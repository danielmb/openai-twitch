import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const patrickBatemanMessage = (
  input: TemplateInput,
) => `${streamerSentMessagesMessages(input)}

Using these messages, generate a message that will be sent.
write a follow-up in the style of a "smart-ass"
Do not create a username and only include the text and dont use any quotes`;

export default patrickBatemanMessage;
