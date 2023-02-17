import { TemplateInput } from '../getTemplate';

export const streamerSentMessagesMessages = ({
  chatMessagesString,
  channelName,
  previousMessages,
}: TemplateInput) => `\
You are watching a streamer called ${channelName}

Some of the previous messages people have sent in the chat are:
${chatMessagesString}`;
