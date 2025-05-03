import { Client, Storage } from 'appwrite';
import { keys } from './keys';

export const client = new Client();

client
  .setEndpoint(`https://${keys().REGION}.cloud.appwrite.io/v1`)
  .setProject(keys().PROJECT_ID);

export const storage = new Storage(client);


export { ID } from 'appwrite';

export * from '@vercel/blob/client';
