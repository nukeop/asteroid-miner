import type { ModAPI } from './ModAPI';

export interface ModManifest {
  name: string;
  version: string;
  description: string;
  author: string;
}

export interface Mod {
  manifest: ModManifest;
  onLoad(api: ModAPI): void | Promise<void>;
  onUnload(api: ModAPI): void | Promise<void>;
}
