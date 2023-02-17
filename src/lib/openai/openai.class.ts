import { Configuration, OpenAIApi } from 'openai';

export class OpenAI {
  private openai: OpenAIApi;
  temprature: number = 0.7;
  maxTokens: number = 256;
  topP: number = 1;
  frequencyPenalty: number = 0;
  presencePenalty: number = 0;
  model: string = 'davinci';
  stop: string[] = ['\r\n', '\r', '\n'];
  constructor(apiKey: string) {
    const config = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(config);
  }
  setTemprature(temprature: number) {
    this.temprature = temprature;
    return this;
  }
  setMaxTokens(maxTokens: number) {
    this.maxTokens = maxTokens;
    return this;
  }
  setTopP(topP: number) {
    this.topP = topP;
    return this;
  }
  setFrequencyPenalty(frequencyPenalty: number) {
    this.frequencyPenalty = frequencyPenalty;
    return this;
  }
  setPresencePenalty(presencePenalty: number) {
    this.presencePenalty = presencePenalty;
    return this;
  }
  setModel(model: string) {
    this.model = model;
    return this;
  }
  setStop(stop: string[]) {
    this.stop = stop;
    return this;
  }
  async complete(prompt: string) {
    let res = await this.openai.createCompletion({
      model: this.model,
      prompt,
      max_tokens: this.maxTokens,
      temperature: this.temprature,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
      presence_penalty: this.presencePenalty,
      stop: this.stop,
    });
    let responseClass = new OpenAIResponse();
    if (res.data.choices) {
      res.data.choices.forEach((choice) => {
        if (choice.text) responseClass.addData(choice.text);
      });
    }
    return responseClass;
  }
}

export class OpenAIResponse {
  responses: string[] = [];
  constructor(data?: string[]) {
    if (data) {
      this.responses = data;
    }
  }
  addData(data: string) {
    this.responses.push(data);
  }
  hasResponse() {
    return this.responses.length > 0;
  }
  getFirstResponse() {
    return this.responses[0];
  }
}
