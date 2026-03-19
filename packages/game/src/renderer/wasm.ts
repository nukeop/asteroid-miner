import init, { load_data_pack } from '@wasm';

import type { Definitions } from './stores/useDefinitionsStore';

let initialized = false;

export async function initWasm(): Promise<void> {
  if (initialized) {
    return;
  }
  await init();
  initialized = true;
}

export function parseDataPack(files: {
  manifest: string;
  skills: string;
  traits: string;
  origins: string;
  careers: string;
  tags: string;
  resources: string;
  formations: string;
  asteroid_types: string;
}): Definitions {
  return load_data_pack(files) as Definitions;
}
