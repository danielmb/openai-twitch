import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const sarcasticReply = (
  input: TemplateInput,
) => `${streamerSentMessagesMessages(input)}

Using these messages, generate a message that will be sent.
write a sarcastic reply that embarrasses the streamer.
Do not create a username and only include the text and dont use any quotes`;

export default sarcasticReply;
