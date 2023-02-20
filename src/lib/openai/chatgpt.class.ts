import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt';
import { OpenAIResponse } from './openai.class';

interface ConstructorOptionsChatGPT {
  apiKey?: string;
  accessToken?: string;
  apiReverseProxyUrl?: string;
}
export class ChatGPT {
  private chatgpt: ChatGPTAPI | ChatGPTUnofficialProxyAPI;
  queue: OpenAIResponse[] = [];
  constructor(options: ConstructorOptionsChatGPT) {
    if (options.apiKey) {
      this.chatgpt = new ChatGPTAPI({
        apiKey: options.apiKey,
      });
    } else if (options.accessToken && options.apiReverseProxyUrl) {
      this.chatgpt = new ChatGPTUnofficialProxyAPI({
        accessToken: options.accessToken,
        apiReverseProxyUrl: options.apiReverseProxyUrl,
      });
    } else {
      throw new Error('Invalid options');
    }
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
