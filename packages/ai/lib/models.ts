import { createOpenAI } from '@ai-sdk/openai';
import { createOllama } from 'ollama-ai-provider';
import { keys } from '../keys';

export const ollama = createOllama();
export const openaiClient = createOpenAI({
  apiKey: keys().OPENAI_API_KEY,
  compatibility: 'strict',
});

export const models = {
  chat: openaiClient('gpt-4o-mini'),
  local: ollama('llama3.1:latest'),
  // google: google('gemini-2.0-flash-lite-preview-02-05'),
  embeddings: openaiClient('text-embedding-3-small'),
};
