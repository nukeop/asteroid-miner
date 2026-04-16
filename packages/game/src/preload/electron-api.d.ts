import type { DataPackFiles } from '@asteroid-miner/model';

type IpcResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

interface ElectronAPI {
  saveGame: (data: string) => Promise<IpcResult>;
  loadGame: () => Promise<IpcResult<string>>;
  loadDataPack: (packPath: string) => Promise<IpcResult<DataPackFiles>>;
  getBaseDataPath: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
