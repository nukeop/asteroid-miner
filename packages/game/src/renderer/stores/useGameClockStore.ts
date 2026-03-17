import { create } from 'zustand';

type GameClockState = {
  turn: number;
  advanceDay: () => void;
  reset: () => void;
};

export const useGameClockStore = create<GameClockState>()((set) => ({
  turn: 1,
  advanceDay: () => set((state) => ({ turn: state.turn + 1 })),
  reset: () => set({ turn: 1 }),
}));
