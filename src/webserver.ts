import express from 'express';
import { cachedMessage, generate, sendMessage } from '.';
const app = express();

app.get('/generateMessage', async (req, res) => {
  let msg = await generate();
  res.send(msg);
});

app.get('/sendMessage', async (req, res) => {
  sendMessage(cachedMessage);
  res.send(cachedMessage);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
