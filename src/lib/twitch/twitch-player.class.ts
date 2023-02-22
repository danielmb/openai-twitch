import axios, { AxiosResponse } from 'axios';
import {
  ComscoreStreamingQueryResponse,
  StreamMetadataResponse,
  StreamPlaybackAccessTokenResponse,
} from './twitch-player.types';
import m3u8 from 'm3u8';
type GetHLSStreamUrlResponse = [
  StreamMetadataResponse,
  ComscoreStreamingQueryResponse,
  StreamPlaybackAccessTokenResponse,
];
const headers = {
  'Content-Type': 'text/plain;charset=UTF-8',
  'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
};
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { EventEmitter } from 'node:events';

const fileExists = (path: string) => {
  try {
    fs.accessSync(path);
    return true;
  } catch (e) {
    return false;
  }
};
const createProcess = (exe: string, args: string[], opts: any) => {
  const binaries = [exe, `${exe}.exe`];
  for (const name of binaries) {
    for (const dir of ['.'].concat(
      (process.env.PATH || '').split(path.delimiter),
    )) {
      const binary = dir + path.sep + name;
      if (!fileExists(binary)) continue;

      return spawn(name, args, opts);
    }
  }
  throw new Error(`NO ${exe} FOUND`);
};
export class Player {
  channelName: string;
  playing: boolean;
  formats: Map<string, string> = new Map();
  format: string = 'audio_only';
  url: string | null = null;
  player: ChildProcessWithoutNullStreams | null = null;
  buffer: Buffer[] = [];
  buffering: boolean = true;
  writing: boolean = true;
  bufferPaused: boolean = false;
  upperBufferLimit: number = 100;
  lowerBufferLimit: number = 50;
  volume: number = 1;
  event: EventEmitter = new EventEmitter();
  listenToAudio: boolean = false;
  metadata: StreamMetadataResponse['data']['user'] | null = null;
  streamdata: ComscoreStreamingQueryResponse['data']['user'] | null = null;
  constructor(channelName: string) {
    console.log(channelName);
    this.channelName = channelName.toLowerCase();
    this.playing = false;
  }
  async init() {
    await this.getHLSStreamUrl(); // debug for now
    this.setFormat('audio_only');
    this.play();
  }
  async getHLSStreamUrl() {
    const gql = await axios.post<GetHLSStreamUrlResponse>(
      'https://gql.twitch.tv/gql',
      [
        {
          operationName: 'StreamMetadata',
          variables: {
            channelLogin: this.channelName,
          },
          extensions: {
            persistedQuery: {
              version: 1,
              sha256Hash:
                '1c719a40e481453e5c48d9bb585d971b8b372f8ebb105b17076722264dfa5b3e',
            },
          },
        },
        {
          operationName: 'ComscoreStreamingQuery',
          variables: {
            channel: this.channelName,
            clipSlug: '',
            isClip: false,
            isLive: true,
            isVodOrCollection: false,
            vodID: '',
          },
          extensions: {
            persistedQuery: {
              version: 1,
              sha256Hash:
                'e1edae8122517d013405f237ffcc124515dc6ded82480a88daef69c83b53ac01',
            },
          },
        },
        {
          query: `{streamPlaybackAccessToken(channelName: "${this.channelName}", params: {platform: "web", playerBackend: "mediaplayer", playerType: "site"}) {value, signature}}`,
        },
      ],
      {
        headers,
      },
    );

    const [streamMetadata, streamData, streamPlaybackAccessToken] = gql.data;
    this.metadata = streamMetadata.data.user;
    this.streamdata = streamData.data.user;
    console.log('CHANNEL NAME: ', this.channelName);
    if (!streamMetadata.data.user) {
      throw new Error('Channel does not exist');
    }
    if (!streamMetadata.data.user.stream) {
      throw new Error('Stream is offline');
    }
    const hlsUrl = new URL(
      `https://usher.ttvnw.net/api/channel/hls/${this.channelName}.m3u8`,
    );
    hlsUrl.search = new URLSearchParams({
      allow_source: 'true',
      allow_audio_only: 'true',
      allow_spectre: 'false',
      p: Math.floor(Math.random() * 9999999999).toString(),
      player: 'twitchweb',
      playlist_include_framerate: 'true',
      segment_preference: '4',
      sig: streamPlaybackAccessToken.data.streamPlaybackAccessToken.signature,
      token: streamPlaybackAccessToken.data.streamPlaybackAccessToken.value,
    }).toString();
    const res = await axios.get(hlsUrl.toString(), {
      headers,
      responseType: 'stream',
    });
    let formats = (await this.getFormat(res)) as Map<string, string>;
    this.formats = formats;
    return formats;
  }
  private async getFormat(body: AxiosResponse<any, any>) {
    return new Promise((resolve, reject) => {
      const formats = new Map();
      const parser = m3u8.createStream();
      body.data.pipe(parser);
      parser.on('item', (item) => {
        const key = item.get('video');
        if (!key) return;
        formats.set(key === 'chunked' ? 'source' : key, item.get('uri'));
      });

      parser.once('error', (err) => {
        reject(err);
      });

      parser.once('m3u', () => {
        resolve(formats);
      });
    });
  }
  setFormat(format: string) {
    if (!this.formats.has(format)) {
      throw new Error('Invalid format');
    }
    this.url = this.formats.get(format) as string;
    this.format = format;
  }
  play() {
    if (!this.url) {
      throw new Error('No url set');
    }
    if (this.playing) {
      return;
    }
    this.playing = true;
    console.log('Playing');
    if (this.format === 'audio_only') {
      this.player = createProcess(
        'ffmpeg',
        [
          '-re',
          '-i',
          this.url,
          '-f',
          's16le',
          '-ar',
          '48000',
          '-af',
          'volume=1',
          '-ac',
          '1',
          'pipe:1',
        ],
        { stdio: ['pipe', 'pipe', 'ignore'] },
      );
      this.player.stdout.once('readable', this._ffmpegReadable);

      this.player.stdout.on('error', this._ffmpegError);

      this.player.stdout.once('close', this._ffmpegClose);
    }
  }

  _ffmpegReadable = () => {
    console.log('ffmpeg readable');
  };
  _ffmpegError = (err: Error) => {
    console.error(err);
  };
  _ffmpegClose = (msg: string) => {
    console.log(msg);
    console.log('ffmpeg closed');
  };
}
