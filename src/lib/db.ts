// db.ts
import { MongoClient, Db } from 'mongodb';
import { IMessage } from './twitch/message.class';
import * as dotenv from 'dotenv';
dotenv.config();
if (!process.env.MONGO_URL) throw new Error('MONGO_URL not set');

let cachedDb: Db | null = null;
let cachedClient: MongoClient | null = null;

export const connect = async () => {
  if (cachedDb) return cachedDb;
  if (cachedClient) return cachedClient.db();
  const client = new MongoClient(process.env.MONGO_URL as string, {});
  console.log('connecting to db' + process.env.MONGO_URL);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db();
  console.log('connected to db' + process.env.MONGO_URL);
  return cachedDb;
};

export const dbAddChannel = async (channel: string) => {
  const db = await connect();
  const collection = db.collection('channels');
  const result = await collection.insertOne({
    channel,
  });
  return result;
};

export const dbAddMessage = async (channel: string, message: IMessage) => {
  const db = await connect();
  const collection = db.collection('messages');
  const result = await collection.insertOne({
    channel,
    message,
  });
  return result;
};

export interface IMessageDB {
  channel: string;
  message: IMessage;
}
export const dbGetMessages = async (channel: string) => {
  const db = await connect();
  const collection = db.collection<IMessageDB>('messages');
  const result = await collection
    .find({
      channel,
    })
    .toArray();

  return result;
};
