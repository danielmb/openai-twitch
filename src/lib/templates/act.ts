import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const act = (input: TemplateInput) => `${streamerSentMessagesMessages(input)}

Generate a new comment that takes the previous comments into consideration. include at least one twitch-emote. act like they do, and keep the comment relatively short.
Don't be positive, use twitch-emotes and internet slang.
Do not create a username and only include the text and dont use any quotes`;

export default act;
