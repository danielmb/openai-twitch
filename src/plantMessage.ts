import { Chat } from './lib/twitch/chat.class';
import fs from 'fs';
import { dbGetAllMessages, IMessageDB } from './lib/db';
setTimeout(async () => {
  chat.addMessage({
    username: 'Raptorious_'.toLowerCase(),
    message: `StemDespair`,
  });
}, 500);

let chat = new Chat('#simply', 'denq_q');
