import aggresiveResponse from './response-templates/aggresive-response';
import epicGamerResponse from './response-templates/epic-gamer-response';
import orwellResponse from './response-templates/orwell-response';
import orwellQuestion from './templates/orwell-question';
import { Message } from './twitch/message.class';

export interface MentionTemplateInput {
  channelName?: string;
  mention?: Message;
  maxLength?: number;
  watcherName?: string;
}

type MentionTemplate = (input: MentionTemplateInput) => string;
type MentionTemplates = MentionTemplate[];

const mentionTemplates: MentionTemplates = [
  aggresiveResponse,
  epicGamerResponse,
];

export const getRandomMentionTemplate = (
  input: MentionTemplateInput,
  endWith: string = '',
): string => {
  const template =
    mentionTemplates[Math.floor(Math.random() * mentionTemplates.length)];
  return template(input) + endWith;
};
