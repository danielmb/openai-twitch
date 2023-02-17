import { Chat } from './lib/twitch/chat.class';
import fs from 'fs';
import { dbGetAllMessages, IMessageDB } from './lib/db';
setTimeout(async () => {
  let messages = await dbGetAllMessages();
  // Everytime my bot have been @mentioned
  console.log(
    messages.filter(
      (m) =>
        m.message.message.includes('@denq_q') ||
        m.message.message.includes('@queenemilie_'),
    ).length,
  );

  fs.writeFileSync(
    'logs/mentioned.json',
    JSON.stringify(
      messages.filter(
        (m) =>
          m.message.message.includes('@denq_q') ||
          m.message.message.includes('@queenemilie_'),
      ),
      null,
      2,
    ),
  );
  const reduced = messages.reduce((acc, cur) => {
    if (!acc[cur.channel]) {
      acc[cur.channel] = [];
    }
    acc[cur.channel].push(cur);
    return acc;
  }, {} as { [key: string]: IMessageDB[] });
  for (let channel in reduced) {
    fs.writeFileSync(
      `logs/${channel.replace('#', '')}.json`,
      JSON.stringify(reduced[channel], null, 2),
    );
  }
}, 5000);
