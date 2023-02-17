import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const urMom = (input: TemplateInput) => `${streamerSentMessagesMessages(input)}

Write a ur mom joke in style of a epic gamer. Use internet slang, ironic memes and emojis.
Do not create a username and only include the text and dont use any quotes`;

export default urMom;
