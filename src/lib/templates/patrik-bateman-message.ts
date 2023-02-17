import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const patrickBatemanMessage = (
  input: TemplateInput,
) => `${streamerSentMessagesMessages(input)}

Write a chat message in style of Patrick Bateman. 
Do not create a username and only include the text and dont use any quotes`;

export default patrickBatemanMessage;
