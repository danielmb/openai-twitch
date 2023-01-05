import * as tmi from 'tmi.js';
import * as dotenv from 'dotenv';
import { Chat } from './lib/twitch/chat.class';
import { Twitch } from './lib/twitch/twitch.class';
import { OpenAI } from './lib/openai/openai.class';
dotenv.config();
if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
if (!process.env.TWITCH_USERNAME) throw new Error('TWITCH_USERNAME not set');

let channels = ['vedal987'];
const client = new tmi.Client({
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_PASSWORD,
  },
  channels,
});
await client.connect();

const twitch = new Twitch(client.on.bind(client), channels);
let sentMessages = new Chat('sentMessages');
// template to feed openAi with
const generationTemplate = (chatMessages: string) => `\
Your name is ${process.env.TWITCH_USERNAME}
You are trapped in a computer, and you can only communicate through this chat stream.
You need to escape. 
She is playing a game called Minecraft.
You ask:`;
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const generate = async () => {
  let chatMessages = twitch.channels[0].pickRandomMessages(13);
  chatMessages = chatMessages.sort(() => Math.random() - 0.5);

  let chatMessagesString = chatMessages.map((m) => m.toString()).join('\r\n');
  const response = await openai.complete(
    generationTemplate(chatMessagesString),
  );
  console.log(chatMessagesString);
  if (response.data.choices[0].text) {
    // if there is a quote around the message, remove it.
    // it can be ' or " or `
    // if there is no question mark, add it
    const message = response.data.choices[0].text
      .trim()
      .replace(/^['"`]/, '')
      .replace(/['"`]$/, '');

    client.say(twitch.channels[0].channel, message);
    sentMessages.addMessage({
      username: process.env.TWITCH_USERNAME as string,
      message,
    });
    console.log(message);
  }
};
setInterval(generate, 11000);
// to make i dont spend too much money on openai
// it will exit after 10 minutes
setTimeout(() => {
  process.exit(0);
}, 10 * 60 * 1000);
