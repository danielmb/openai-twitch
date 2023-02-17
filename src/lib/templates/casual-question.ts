import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const casualQuestion = (
  input: TemplateInput,
) => `${streamerSentMessagesMessages(input)}

Write a question that will be sent
Do not create a username and only include the text and dont use any quotes`;

export default casualQuestion;
