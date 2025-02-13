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
  // google: google('gemini-2.0-flash-lite-preview-02-05'),
  embeddings: openai('text-embedding-3-small'),
};
