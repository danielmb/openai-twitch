// import * as nodeRecordLpcm16 from 'node-record-lpcm16';
import { SpeechClient } from '@google-cloud/speech';
import { google } from '@google-cloud/speech/build/protos/protos';
import Pumpify from 'pumpify';
// typedemitter
import { EventEmitter } from 'node:events';
import TypedEmitter from 'typed-emitter';

process.env.DEBUG = 'record';
// Creates a client
const client = new SpeechClient();

const encoding = 'LINEAR16'; // Can be
const sampleRateHertz = 48000;
const languageCode = 'en-US';

const request: google.cloud.speech.v1.IStreamingRecognitionConfig = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false,
};

// Create a recognize stream

type TranscriberEvents = {
  transcription: (transcription: string) => void;
};

export class Transcriber {
  private request: google.cloud.speech.v1.IStreamingRecognitionConfig;
  recognizeStream: Pumpify;
  transcriptions: string[] = [];
  transcription: string = '';
  events: TypedEmitter<TranscriberEvents> =
    new EventEmitter() as TypedEmitter<TranscriberEvents>;
  constructor({
    config,
  }: {
    config?: google.cloud.speech.v1.IStreamingRecognitionConfig;
  }) {
    this.request = config || request;
    this.recognizeStream = client.streamingRecognize(this.request);
    this.recognizeStream.on('error', console.error);
    this.recognizeStream.on('data', this.handleTranscription);
    this.recognizeStream.on('end', () => {
      this.recognizeStream = client.streamingRecognize(this.request);
      this.recognizeStream.on('error', console.error);
      this.recognizeStream.on('data', this.handleTranscription);
    });
  }
  handleTranscription = (data: any) => {
    this.transcription =
      data.results[0] && data.results[0].alternatives[0]
        ? data.results[0].alternatives[0].transcript
        : '';
    this.transcriptions.push(this.transcription);
    this.events.emit('transcription', this.transcription);
  };
}

// Start recording and send the microphone input to the Speech API.
// Ensure SoX is installed, see https://www.npmjs.com/package/node-record-lpcm16#dependencies
// console
// nodeRecordLpcm16.default
//   .record({
//     sampleRateHertz: sampleRateHertz,
//     threshold: 0,
//     // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
//     verbose: false,
//     recordProgram: 'sox', // Try also "arecord" or "sox"
//     silence: '10.0',
//   })
//   .stream()
//   .on('error', console.error)
//   .pipe(recognizeStream);

console.log('Listening, press Ctrl+C to stop.');
