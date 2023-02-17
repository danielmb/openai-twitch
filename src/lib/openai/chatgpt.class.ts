import { ChatGPTAPI } from 'chatgpt';
import { OpenAIResponse } from './openai.class';
if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
let chatgpt = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class ChatGPT {
  private chatgpt: ChatGPTAPI;
  queue: OpenAIResponse[] = [];
  constructor() {
    this.chatgpt = chatgpt;
  }
  async complete(prompt: string) {
    let res = new OpenAIResponse();
    this.queue.push(res);
    console.log('queue length: ' + this.queue.length);
    while (this.queue[0] !== res) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    console.log('resolving');
    let response = await this.chatgpt.sendMessage(prompt);
    res.addData(response.text);
    this.queue.shift();
    return res;
  }
}
