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

export async function initializeDefinitionsStore() {
  const result = await window.electronAPI.loadDefinitions();

  result.warnings.forEach((warning) => {
    console.warn(warning);
  });
  result.errors.forEach((error) => {
    console.error(error);
  });

  useDefinitionsStore.getState().setDefinitions(result.value);
}
