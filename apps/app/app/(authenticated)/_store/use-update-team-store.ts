import { create } from 'zustand';
import type { InferSelectModel } from '@repo/database';
import type { team } from '@repo/database/schema';

type Team = InferSelectModel<typeof team>;

interface UpdateTeamStore {
  isOpen: boolean;
  team: Team | null;
  setIsOpen: (isOpen: boolean) => void;
  setTeam: (team: Team | null) => void;
  reset: () => void;
}

export const useUpdateTeamStore = create<UpdateTeamStore>((set) => ({
  isOpen: false,
  team: null,
  setIsOpen: (isOpen) => set({ isOpen }),
  setTeam: (team) => set({ team }),
  reset: () => set({ isOpen: false, team: null }),
}));
