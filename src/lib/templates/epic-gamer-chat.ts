import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const epicGamerChat = (input: TemplateInput) => `${streamerSentMessagesMessages(
  input,
)}
Write a chat message in style of a epic gamer. Use internet slang, ironic memes and twitch emotes.
Do not create a username and only include the text and dont use any quotes`;

export default epicGamerChat;
