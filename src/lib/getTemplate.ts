import epicGamerResponse from './response-templates/epic-gamer-response';
import act from './templates/act';
import aiMessage from './templates/ai-message';
import anitJoke from './templates/anti-joke';
import casualChat from './templates/casual-message';
import casualQuestion from './templates/casual-question';
import depressed from './templates/depressed';
import epicGamerChat from './templates/epic-gamer-chat';
import epicGamerGoodnight from './templates/epic-gamer-goodnight';
import epicGamerQuestion from './templates/epic-gamer-question';
import identical from './templates/identical';
import newbie from './templates/newbie';
import orwellQuestion from './templates/orwell-question';
import passiveAggresiveOmegalul from './templates/passive-aggresive-omegalul';
import patrickBatemanQuestion from './templates/patrick-bateman-question';
import patrickBatemanMessage from './templates/patrik-bateman-message';
import philosopherExistensialCrisis from './templates/philosopher-existensial-crisis';
import sarcasticReply from './templates/sarcastic-reply';
import smartAss from './templates/smart-ass';
import twitchEmotes from './templates/twitch-emotes';
import urMom from './templates/ur-mom';
import yodaMessage from './templates/yoda-message';
import yodaQuestion from './templates/yoda-question';

export interface TemplateInput {
  chatMessagesString?: string;
  channelName?: string;
  previousMessages?: string;
}
export type Template = (input: TemplateInput) => string;

//

const templates: Template[] = [
  // casualChat,
  // casualQuestion,
  // yodaMessage,
  // orwellQuestion,
  // yodaQuestion,
  epicGamerChat,
  // epicGamerQuestion,
  // patrickBatemanMessage,
  // patrickBatemanQuestion,
  // aiMessage,
  // urMom,
  smartAss,
  passiveAggresiveOmegalul,
  sarcasticReply,
  // newbie,
  // philosopherExistensialCrisis,
  // depressed,
  // twitchEmotes,
  // identical,
  // anitJoke,
  // epicGamerGoodnight,
  act,
];

export const getRandomTemplate = (input: TemplateInput): string => {
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(input);
};

export const generateFromTemplate = (
  template: Template,
  input: TemplateInput,
) => {
  return template(input);
};
