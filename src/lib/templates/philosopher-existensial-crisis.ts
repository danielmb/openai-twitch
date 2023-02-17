import { TemplateInput } from '../getTemplate';
import { streamerSentMessagesMessages } from '../template-preset/streamer-sentMesssages-messages';

const philosopherExistensialCrisis = (
  input: TemplateInput,
) => `${streamerSentMessagesMessages(input)}

Using these messages generate a message that will be sent
write a reply in the style of a philosopher having a existential crisis 
Do not create a username and only include the text and dont use any quotes`;

export default philosopherExistensialCrisis;
