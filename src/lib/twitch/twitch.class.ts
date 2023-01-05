import { Chat } from './chat.class';
import * as tmi from 'tmi.js';

export class Twitch {
  channels: Chat[];
  constructor(on: tmi.Client['on'], channels: string[] = []) {
    this.channels = channels.map((c) => new Chat(c));
    on('message', this.handleMessage.bind(this));
  }
  addChannel(channel: string) {
    this.channels.push(new Chat(channel));
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
