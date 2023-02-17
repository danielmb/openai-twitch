import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const depressed = (input: TemplateInput) => `${streamerSentMessagesMessages(
  input,
)}

Using these messages, generate a message that will be sent.
write a reply while acting depressed
Do not create a username and only include the text and dont use any quotes`;

export default depressed;
