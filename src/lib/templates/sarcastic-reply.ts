import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const sarcasticReply = (
  input: TemplateInput,
) => `${streamerSentMessagesMessages(input)}

Using these messages, generate a message that will be sent.
The message should be a sarcastic reply to a random message in the chat. Start the message with the @username of the person who sent the message
Do not create a username and only include the text and dont use any quotes`;

export default sarcasticReply;
