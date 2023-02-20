import { Chat } from './lib/twitch/chat.class';
import fs from 'fs';
let sentMessages = new Chat('sentMessages', 'denq_q');

setTimeout(() => {
  let messages = sentMessages.getLatestMessages(1000);
  fs.writeFileSync(
    'logs/sentMessagess.json',
    JSON.stringify(messages, null, 2),
  );
  fs.writeFileSync(
    'logs/sentMessagess.txt',
    messages.map((m) => m.message).join('\r\n\r\n'),
  );
  process.exit(0);
}, 5000);
