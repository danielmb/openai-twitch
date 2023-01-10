import * as tmi from 'tmi.js';
import * as dotenv from 'dotenv';
import { Chat } from './lib/twitch/chat.class';
import { Twitch } from './lib/twitch/twitch.class';
import { OpenAI } from './lib/openai/openai.class';
dotenv.config();
if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
if (!process.env.TWITCH_USERNAME) throw new Error('TWITCH_USERNAME not set');

let channels = ['voluto97'];
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
const generationDefaultTemplate = (chatMessages: string) => `\
You are watching ${twitch.channels[0].channel}
Don't add !commands to your message. Do not post links or spam.
[Chat]
${chatMessages}
${process.env.TWITCH_USERNAME}:`;
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const generate = async () => {
  let chatMessages = twitch.channels[0].pickRandomMessages(13);
  chatMessages = chatMessages.sort(() => Math.random() - 0.5);
  let chatMessagesString = chatMessages.map((m) => m.toString()).join('\r\n');
  const response = await openai.complete(
    generationDefaultTemplate(chatMessagesString),
  );

  if (response.data.choices[0].text) {
    console.log(
      generationDefaultTemplate(chatMessagesString) +
        response.data.choices[0].text,
    );
    const message = (response.data.choices[0].text as string)
      .trim()
      .replace(/^['"`]/, '')
      .replace(/['"`]$/, '');

    console.log(`ctrl-c to cancel, will send message in 10 seconds`);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    client.say(twitch.channels[0].channel, message);
    sentMessages.addMessage({
      username: process.env.TWITCH_USERNAME as string,
      message,
    });
    setTimeout(generate, 2500);
  }
};

setTimeout(generate, 2500);

const generationMentionTemplate = (mention: string, latestMessage: string) => `\
You are watching ${twitch.channels[0].channel} and you have been mentioned!
${latestMessage}
${mention}
${process.env.TWITCH_USERNAME}:`;

twitch.channels[0].events.on('mention', async (message) => {
  console.log(message);
  let latestMessage = sentMessages.getLatestMessage();
  let mention = message;
  let msg = generationMentionTemplate(
    mention.toString(),
    latestMessage.toString(),
  );
  const response = await openai.complete(msg);
  if (response.data.choices[0].text) {
    console.log(msg + response.data.choices[0].text);
    const message = (response.data.choices[0].text as string)
      .trim()
      .replace(/^['"`]/, '')
      .replace(/['"`]$/, '');

    console.log(`ctrl-c to cancel, will send message in 10 seconds`);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    client.say(twitch.channels[0].channel, message);
    sentMessages.addMessage({
      username: process.env.TWITCH_USERNAME as string,
      message,
    });
  }
});

// to make i dont spend too much money on openai
// it will exit after 10 minutes
setTimeout(() => {
  process.exit(0);
}, 10 * 60 * 1000);
