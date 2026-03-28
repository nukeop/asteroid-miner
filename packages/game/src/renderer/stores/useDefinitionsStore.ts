import { create } from 'zustand';

import type { Definitions } from '@asteroid-miner/model';

import { DataPack } from '../data-pack/DataPack';

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
  const packPath = await window.electronAPI.getBaseDataPath();
  const result = await window.electronAPI.loadDataPack(packPath);

  if (!result.ok) {
    throw new Error(result.error);
  }

  const pack = new DataPack(result.data);
  useDefinitionsStore.getState().setDefinitions(pack.definitions);
}
