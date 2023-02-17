import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const identical = (input: TemplateInput) => `${streamerSentMessagesMessages(
  input,
)}

Using these messages, generate a message that will be sent.
If there are more than 5 identical single-word messages, reply with the same identical message, and add a twitch-emote at the end
Do not create a username and only include the text and dont use any quotes`;

export default identical;
