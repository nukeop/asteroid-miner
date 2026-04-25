import type { Definitions, LoadResult, Result } from '@asteroid-miner/model';

interface ElectronAPI {
  saveGame: (data: string) => Promise<Result<void, string>>;
  loadGame: () => Promise<Result<string, string>>;
  loadDefinitions: () => Promise<LoadResult<Definitions>>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
