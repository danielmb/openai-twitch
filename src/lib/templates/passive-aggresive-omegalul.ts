import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const orwellQuestion = (
  input: TemplateInput,
) => `${streamerSentMessagesMessages(input)}

Using these messages generate a message that will be sent
Write a passive aggressive reply that always ends in "OMEGALUL"
Do not create a username and only include the text and dont use any quotess`;

export default orwellQuestion;
