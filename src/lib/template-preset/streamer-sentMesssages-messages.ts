import { TemplateInput } from '../getTemplate';

export const streamerSentMessagesMessages = ({
  chatMessagesString,
  channelName,
  previousMessages,
  streamerTranscription,
  game,
}: TemplateInput) => `\
You are watching a streamer called ${channelName}
${game ? `The game is ${game}` : ''}

Some of the previous messages people have sent in the chat are:
${chatMessagesString}`;
