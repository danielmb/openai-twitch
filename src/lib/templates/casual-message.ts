import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

let casualChat = (input: TemplateInput) => `${streamerSentMessagesMessages(
  input,
)}

Write a chat message that will be sent
Do not create a username and only include the text and dont use any quotes`;

export default casualChat;
