import { IMessage, Message } from './message.class';

export class Chat {
  messages: Message[];
  maxMessages: number = 5000;
  channel: string;
  constructor(channel: string) {
    this.messages = [];
    this.channel = channel;
  }
  addMessage(message: IMessage) {
    this.messages.push(new Message(message.username, message.message));
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
}
