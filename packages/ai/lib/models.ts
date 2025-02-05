import { createOpenAI } from '@ai-sdk/openai';
import { createOllama } from 'ollama-ai-provider';
import { keys } from '../keys';

const ollama = createOllama();
const openai = createOpenAI({
  apiKey: keys().OPENAI_API_KEY,
  compatibility: 'strict',
});

export const models = {
  chat: openai('gpt-4o-mini'),
  local: ollama('llama3.1:latest'),
  embeddings: openai('text-embedding-3-small'),
};
