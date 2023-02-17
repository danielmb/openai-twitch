import * as tmi from 'tmi.js';
import * as dotenv from 'dotenv';
import { Chat } from './lib/twitch/chat.class';
import { Twitch } from './lib/twitch/twitch.class';
import { ChatGPT } from './lib/openai/chatgpt.class';
import { OpenAI } from './lib/openai/openai.class';
import { IMessage, Message } from './lib/twitch/message.class';
import { getRandomTemplate } from './lib/getTemplate';
import { getRandomMentionTemplate } from './lib/getResponseTemplate';
dotenv.config();
if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
if (!process.env.TWITCH_USERNAME) throw new Error('TWITCH_USERNAME not set');
let timeout = 5000;
let channels = ['simply'];
const client = new tmi.Client({
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_PASSWORD,
  },
  channels,
});
await client.connect();
const twitch = new Twitch(
  client.on.bind(client),
  channels.map((c) => c.toLowerCase()),
  process.env.TWITCH_USERNAME as string,
);

const pauseKeypressToCancel = async (ms: number) => {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, ms);
  });
};

let sentMessages = new Chat('sentMessages', process.env.TWITCH_USERNAME);
// template to feed openAi with
let useChatGPT = true;
const openai: OpenAI | ChatGPT = useChatGPT
  ? new ChatGPT()
  : new OpenAI(process.env.OPENAI_API_KEY);

if (twitch.channels[0].channel === 'vedal987') {
  twitch.channels[0].chatFilter = (message: IMessage) => {
    return message.message.endsWith('?');
  };
}

const generate = async () => {
  let chatMessages = twitch.channels[0].getLatestMessages(13);
  let chatMessagesString = chatMessages.map((m) => m.toString()).join('\r\n');
  if (Math.random() < 0.5) {
    // chatMessagesString = twitch.channels[0].pickRandomMessagesAsString(13);
  }
  let previousMessages = sentMessages.getLatestMessages(2);
  let previousMessagesString = previousMessages
    .map((m) => m.toString())
    .join('\r\n');
  let food =
    getRandomTemplate({
      chatMessagesString,
      previousMessages: previousMessagesString,
      channelName: twitch.channels[0].channel.replace('#', ''),
    }) +
    `
  denq_q:`;
  const response = await openai.complete(food);
  if (response.hasResponse() && response.getFirstResponse().length < 150) {
    let responseText = response.getFirstResponse();
    console.log(food + '\n\n\n' + responseText);
    const message = responseText
      .trim()
      .replace(/^['"`]/, '')
      .replace(/['"`]$/, '');
    try {
      await new Promise((resolve) => setTimeout(resolve, 3500));
      if (!generating) {
        client.say(twitch.channels[0].channel, message);
        sentMessages.addMessage({
          username: process.env.TWITCH_USERNAME as string,
          message,
        });
      }
    } catch (e) {
      console.log('cancelled');
    }
  } else {
    if (response.hasResponse()) {
      console.log('response too long');
      console.log(response.getFirstResponse());
    }
  }
  setTimeout(generate, 40000);
};

setTimeout(generate, 155);
let generating = false;
twitch.channels[0].events.on('mention', async (message: Message) => {
  let maxLength = 120;
  console.log(message);
  generating = true;
  let latestMessage = sentMessages.getLatestMessage();
  let mention = message;
  let msg = getRandomMentionTemplate({
    mention: mention,
    channelName: twitch.channels[0].channel,
    maxLength: maxLength,
  });
  const response = await openai.complete(msg);
  if (
    response.hasResponse() &&
    response.getFirstResponse().length < maxLength
  ) {
    let responseText = response.getFirstResponse();
    console.log(msg + '\n' + responseText);
    let message = responseText
      .trim()
      .replace(/^['"`]/, '')
      .replace(/['"`]$/, '');
    message = `@${mention.username} ${message}`;
    // message = `@${mention.username} no`;
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      client.say(twitch.channels[0].channel, message);
      sentMessages.addMessage({
        username: process.env.TWITCH_USERNAME as string,
        message,
      });
      generating = false;
    } catch (e) {
      console.log('cancelled');
    }
  } else {
    if (response.hasResponse()) {
      console.log('Too long :(' + response.getFirstResponse().length);
      console.log(response.getFirstResponse());
    }
  }
  generating = false;
});

// to make i dont spend too much money on openai
// it will exit after 10 minutes
setTimeout(() => {
  process.exit(0);
}, 10 * 60 * 1000);
