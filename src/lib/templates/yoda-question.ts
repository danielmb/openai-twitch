import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const yodaQuestion = (input: TemplateInput) => `${streamerSentMessagesMessages(
  input,
)}

Write a question in style of Yoda.
Do not create a username and only include the text and dont use any quotes`;

export default yodaQuestion;
