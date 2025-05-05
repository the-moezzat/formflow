import { create } from 'zustand';

interface PromptState {
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  currentPrompt: '',
  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
})); 