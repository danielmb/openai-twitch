import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

let twitchEmotes = (input: TemplateInput) => `${streamerSentMessagesMessages(
  input,
)}

Write a chat message that will be sent
reply to the messages using 5 identical twitch-emotes
Do not create a username and only include the text and dont use any quotes`;

export default twitchEmotes;
