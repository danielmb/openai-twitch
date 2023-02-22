import * as tmi from 'tmi.js';
import * as dotenv from 'dotenv';
import { Chat } from './lib/twitch/chat.class';
import { Twitch } from './lib/twitch/twitch.class';
import { ChatGPT } from './lib/openai/chatgpt.class';
import { OpenAI } from './lib/openai/openai.class';
import { IMessage, Message } from './lib/twitch/message.class';
import { getRandomTemplate } from './lib/getTemplate';
import { getRandomMentionTemplate } from './lib/getResponseTemplate';
import sarcasticReply from './lib/templates/sarcastic-reply';
dotenv.config();
if (!process.env.TWITCH_USERNAME) throw new Error('TWITCH_USERNAME not set');
if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_ACCESS_TOKEN) {
  throw new Error('OPENAI_API_KEY or OPENAI_ACCESS_TOKEN must be set');
}
if (process.env.OPENAI_API_KEY && process.env.OPENAI_ACCESS_TOKEN) {
  throw new Error('OPENAI_API_KEY and OPENAI_ACCESS_TOKEN cannot both be set');
}
if (process.env.OPENAI_ACCESS_TOKEN && !process.env.OPENAI_REVERSE_PROXY) {
  throw new Error(
    'OPENAI_REVERSE_PROXY must be set if OPENAI_ACCESS_TOKEN is set',
  );
}
let timeout = 5000;
let channels = [''];
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

let sentMessages = new Chat('sentMessages', process.env.TWITCH_USERNAME);
// template to feed openAi with
let openai: ChatGPT;

if (process.env.OPENAI_API_KEY) {
  openai = new ChatGPT({
    apiKey: process.env.OPENAI_API_KEY,
  });
}
if (process.env.OPENAI_ACCESS_TOKEN && process.env.OPENAI_REVERSE_PROXY) {
  openai = new ChatGPT({
    accessToken: process.env.OPENAI_ACCESS_TOKEN,
    apiReverseProxyUrl: process.env.OPENAI_REVERSE_PROXY,
  });
}

if (twitch.channels[0].channel === 'vedal987') {
  twitch.channels[0].chatFilter = (message: IMessage) => {
    return message.message.endsWith('?');
  };
}
export let cachedMessage = '';
twitch.channels[0].transcript.events.on('transcription', (transcription) => {
  twitch.channels[0].addMessage({
    username: twitch.channels[0].channel.replace(
      '#',
      '[Streamer voice transcription]',
    ),
    message: transcription.trim(),
  });
});
export const generate = async () => {
  let chatMessages = twitch.channels[0].getLatestMessages(13);
  let chatMessagesString = chatMessages.map((m) => m.toString()).join('\r\n');
  if (Math.random() < 0.5) {
    // chatMessagesString = twitch.channels[0].pickRandomMessagesAsString(13);
  }
  let previousMessages = sentMessages.getLatestMessages(2);
  let previousMessagesString = previousMessages
    .map((m) => m.toString())
    .join('\r\n');
  // let food = getRandomTemplate({
  let food = getRandomTemplate({
    chatMessagesString,
    previousMessages: previousMessagesString,
    channelName: twitch.channels[0].channel.replace('#', ''),
    game: twitch.channels[0].twitchPlayer?.streamdata?.stream?.game.name,
    streamerTranscription: twitch.channels[0].transcript.transcriptions
      .slice(-5)
      .join('\r\n'),
  });

  food =
    food +
    `
  you:`;

  const response = await openai.complete(food);
  if (response.hasResponse() && response.getFirstResponse().length < 150) {
    let responseText = response.getFirstResponse();
    console.log(food + '\n\n\n' + responseText);
    const message = responseText
      .trim()
      .replace(/^['"`]/, '')
      .replace(/['"`]$/, '');
    try {
      if (!generating) {
        // client.say(twitch.channels[0].channel, message);
        sentMessages.addMessage({
          username: process.env.TWITCH_USERNAME as string,
          message,
        });
        cachedMessage = message;
        return message;
      }
    } catch (e) {
      console.log('cancelled');
    }
  } else {
    if (response.hasResponse()) {
      console.log(food);
      console.log(response.getFirstResponse());
      const message = response
        .getFirstResponse()
        .trim()
        .replace(/^['"`]/, '')
        .replace(/['"`]$/, '');
      cachedMessage = message;

      return message;
    }

    console.log('response too long');
  }
  return '';
};

export const sendMessage = async (message: string) => {
  client.say(twitch.channels[0].channel, message);
  sentMessages.addMessage({
    username: process.env.TWITCH_USERNAME as string,
    message,
  });
};

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
    watcherName: process.env.TWITCH_USERNAME as string,
  });
  msg =
    msg +
    `
  you:`;
  const response = await openai.complete(msg);
  if (
    response.hasResponse() &&
    response.getFirstResponse().length < maxLength
  ) {
    let responseText = response.getFirstResponse();
    console.log();
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
