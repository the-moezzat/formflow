import { create } from 'zustand';

interface BearState {
  selectedVersion: number | null;
  setSelectedVersion: (versionIndex: number | null) => void;
}

export const useVersionHistoryStore = create<BearState>()((set) => ({
  selectedVersion: null,
  setSelectedVersion: (versionIndex) => set({ selectedVersion: versionIndex }),
}));
