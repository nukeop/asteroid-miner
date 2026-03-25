import type { DataPackFiles } from '@asteroid-miner/model';

interface ElectronAPI {
  saveGame: (data: string) => Promise<{ ok: boolean }>;
  loadGame: () => Promise<{ ok: boolean; data: string | null }>;
  loadDataPack: (
    packPath: string,
  ) => Promise<{ ok: boolean; data?: DataPackFiles; error?: string }>;
  getBaseDataPath: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
