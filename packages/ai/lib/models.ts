import { google } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { EmbeddingModelV3, LanguageModelV3 } from "@ai-sdk/provider";
import type { LanguageModel } from "ai";
import { createOllama } from "ollama-ai-provider";
import { keys } from "../keys";

export const ollama = createOllama();
export const openaiClient = createOpenAI({
  apiKey: keys().OPENAI_API_KEY,
});

export const models: {
  chat: LanguageModelV3;
  local: LanguageModel;
  google: LanguageModelV3;
  embeddings: EmbeddingModelV3;
} = {
  chat: openaiClient("gpt-5-nano"),
  local: ollama("llama3.2:latest") as unknown as LanguageModel,
  google: google("gemini-3.1-flash-lite-preview"),
  embeddings: openaiClient.embedding("text-embedding-3-small"),
};
