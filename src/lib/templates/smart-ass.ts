import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const smartAss = (input: TemplateInput) => `${streamerSentMessagesMessages(
  input,
)}

Using these messages, generate a message that will be sent.
The message should be a follow-up with the style "smart-ass"
Do not create a username and only include the text and dont use any quotes`;

export default smartAss;
