import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

let yodaMessage = (input: TemplateInput) => `${streamerSentMessagesMessages(
  input,
)}

Using these messages generate a message that will be sent:
Write a chat message in the style of Yoda
Do not create a username and only include the text and dont use any quotes`;

export default yodaMessage;
