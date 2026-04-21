import { join } from 'node:path';

import type { DataPack } from '@asteroid-miner/model';

import { readTextFile } from './fs';

export async function parseDataPack(dataPackPath: string): Promise<DataPack> {
  const manifestContents = await readTextFile(
    join(dataPackPath, 'manifest.json'),
  );

  return {
    path: dataPackPath,
    manifest: {},
    files: [],
  };
}
