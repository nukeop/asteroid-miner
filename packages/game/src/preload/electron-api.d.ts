import type { DataPack, Result } from '@asteroid-miner/model';

interface ElectronAPI {
  saveGame: (data: string) => Promise<Result<void, string>>;
  loadGame: () => Promise<Result<string, string>>;
  parseDataPack: (path: string) => Promise<DataPack>;
  getBaseDataPath: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
