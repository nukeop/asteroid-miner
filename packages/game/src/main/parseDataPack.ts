import { join } from 'node:path';

import {
  DataPackManifestContentsSchema,
  type DataPack,
} from '@asteroid-miner/model';

import { loadAndParseJson } from './loadAndParseJson';

const MANIFEST_FILENAME = 'package.json';

export async function parseDataPack(dataPackPath: string): Promise<DataPack> {
  const manifest = await loadAndParseJson(
    join(dataPackPath, MANIFEST_FILENAME),
    DataPackManifestContentsSchema,
  );

  return {
    path: dataPackPath,
    manifest,
    files: [],
  };
}
