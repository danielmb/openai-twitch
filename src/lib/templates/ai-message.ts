import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const aiMessage = (input: TemplateInput) => `${streamerSentMessagesMessages(
  input,
)}

You are an AI trying to emulate a human. Write a chat message that will be sent.
Be obvious that you are an AI.
Do not mention OpenAI,
Do not use any quotes or create any username.`;

export default aiMessage;
