import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const newbie = (input: TemplateInput) => `${streamerSentMessagesMessages(input)}

Using these messages, generate a message that will be sent.
write a question relating to the previous messages while acting like a complete newbie to the subject.
Do not create a username and only include the text and dont use any quotes`;

export default newbie;
