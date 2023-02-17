import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

let patrickBatemanQuestion = (
  input: TemplateInput,
) => `${streamerSentMessagesMessages(input)}

Write a question in style of Patrick Bateman.
Do not create a username and only include the text and dont use any quotes`;

export default patrickBatemanQuestion;
