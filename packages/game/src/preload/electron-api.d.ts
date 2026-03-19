interface DataPackFiles {
  manifest: string;
  skills: string;
  traits: string;
  origins: string;
  careers: string;
  tags: string;
  resources: string;
  formations: string;
  asteroid_types: string;
  ship_modules: string;
  machines: string;
}

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
