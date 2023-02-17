import { IMessage, Message } from './message.class';
import { dbAddMessage, dbGetMessages } from '../db';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import * as dotenv from 'dotenv';
import { Twitch } from './twitch.class';

dotenv.config();

type ChatEvents = {
  mention: (message: Message) => void;
};

export class Chat {
  username: string;
  messages: Message[] = [];
  maxMessages: number = 5000;
  channel: string;
  events: TypedEmitter<ChatEvents> =
    new EventEmitter() as TypedEmitter<ChatEvents>;
  chatFilter?: (message: IMessage) => boolean = () => true;
  blacklist: Lowercase<string>[] = [
    'nightbot',
    'fossabot',
    'streamelements',
    'streamlabs',
    'moobot',
    'streamlabsbot',
  ];
  twitch?: Twitch;
  constructor(channel: string, username: string, twitch?: Twitch) {
    this.channel = channel;
    this.username = username;
    this.twitch = twitch;
    console.log(`Chat created for channel ${channel}`);
    dbGetMessages(channel).then((messages) => {
      for (const message of messages) {
        this.addMessage(message.message, false);
      }
      console.log(`Chat loaded ${this.messages.length} messages`);
    });
  }
  addMessage(message: IMessage, db: boolean = true) {
    if (
      this.blacklist.find(
        (b) => b.toLowerCase() === message.username.toLowerCase(),
      )
    )
      return;
    if (message.message.startsWith('!')) return;
    if (this.chatFilter && !this.chatFilter(message)) return;
    if (db) dbAddMessage(this.channel, message);
    if (
      message.message.toLowerCase().includes(`${this.username}`) &&
      db &&
      message.username !== this.username
    ) {
      console.log(`Mentioned in ${this.channel} ${db}`);
      this.events.emit(
        'mention',
        new Message(message.username, message.message, this.channel),
      );
    }
    this.messages.push(
      new Message(message.username, message.message, this.channel),
    );
    this.messages = this.messages.slice(-this.maxMessages);
  }
  set limit(limit: number) {
    this.maxMessages = limit;
    this.messages = this.messages.slice(-limit);
  }
  messagesString(maxMessages: number = this.maxMessages): string {
    return this.messages
      .slice(-maxMessages)
      .map((m) => m.toString())
      .join('\r\n');
  }
  pickRandomMessage(): Message {
    return this.messages[Math.floor(Math.random() * this.messages.length)];
  }
  pickRandomMessages(maxMessages: number = this.maxMessages): Message[] {
    return this.messages.sort(() => Math.random() - 0.5).slice(-maxMessages);
  }
  pickRandomMessagesAsString(maxMessages: number = this.maxMessages): string {
    return this.pickRandomMessages(maxMessages)
      .map((m) => m.toString())
      .join('\r\n');
  }
  getLatestMessage(): Message {
    return this.messages[this.messages.length - 1];
  }
  getLatestMessages(maxMessages: number = this.maxMessages): Message[] {
    return this.messages.slice(-maxMessages);
  }
}
