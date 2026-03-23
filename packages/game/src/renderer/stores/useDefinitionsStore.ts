import { create } from 'zustand';

import type { Definitions } from '@asteroid-miner/model';

export type { Definitions };

type DefinitionsState = {
  definitions: Definitions | null;
  setDefinitions: (defs: Definitions) => void;
};

export const useDefinitionsStore = create<DefinitionsState>()((set) => ({
  definitions: null,
  setDefinitions: (defs) => set({ definitions: defs }),
}));
