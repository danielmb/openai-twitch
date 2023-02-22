import { Chat } from './chat.class';
import * as tmi from 'tmi.js';
import { Transcriber } from '../speech';
import { Player } from './twitch-player.class';
export interface TwitchOptions {
  ignoreSelf?: boolean;
}
export class Twitch {
  channels: Chat[] = [];
  username: string;
  options: TwitchOptions = {};

  constructor(
    on: tmi.Client['on'],
    channels: string[] = [],
    username: string,
    options?: TwitchOptions,
  ) {
    console.log(username);
    this.username = username;
    channels.map((c) => this.addChannel(c));
    this.options = options || this.options;
    on('message', this.handleMessage.bind(this));

  }
  addChannel(channel: string) {
    this.channels.push(new Chat(channel, this.username, this));
  }
  handleMessage(
    channel: string,
    userstate: tmi.ChatUserstate,
    message: string,
    self: boolean,
  ) {
    if (self) return;
    if (userstate['display-name'])
      this.channels
        .find((c) => c.channel === channel)
        ?.addMessage({ username: userstate['display-name'], message });
  }
}
