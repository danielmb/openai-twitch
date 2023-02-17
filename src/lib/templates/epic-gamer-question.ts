import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const epicGamerQuestion = (
  input: TemplateInput,
) => `${streamerSentMessagesMessages(input)}

Write a question in style of a epic gamer. Use internet slang, ironic memes and twitch emotes.
Do not create a username and only include the text and dont use any quotes`;

export default epicGamerQuestion;
