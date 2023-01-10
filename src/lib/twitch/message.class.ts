export interface IMessage {
  username: string;
  message: string;
}
export type MessageString = `${IMessage['username']}: ${IMessage['message']}`;
export class Message implements IMessage {
  username: string;
  message: string;
  channel: string;
  constructor(username: string, message: string, channel: string) {
    this.username = username;
    this.message = message;
    this.channel = channel;
  }
  toString(): MessageString {
    return `${this.username}: ${this.message}`;
  }
}
