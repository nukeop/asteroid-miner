import { create } from 'zustand';

import type { DataPack, Definitions } from '@asteroid-miner/model';

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
  const pack: DataPack = await window.electronAPI.parseDataPack(packPath);
  void pack;
}
