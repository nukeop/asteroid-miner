import { join } from 'node:path';

import {
  DataPackManifestContentsSchema,
  type DataPack,
  type DataPackFile,
} from '@asteroid-miner/model';

import { readTextFile } from './fs';
import { loadAndParseJson } from './loadAndParseJson';

const MANIFEST_FILENAME = 'package.json';

export async function parseDataPack(dataPackPath: string): Promise<DataPack> {
  const manifest = await loadAndParseJson(
    join(dataPackPath, MANIFEST_FILENAME),
    DataPackManifestContentsSchema,
  );

  if (!manifest.contents.ok) {
    return { path: dataPackPath, manifest, files: [] };
  }

  const files: DataPackFile[] = await Promise.all(
    manifest.contents.value.dataPack.files.map(async (relativePath) => {
      const path = join(dataPackPath, relativePath);
      return { path, text: await readTextFile(path) };
    }),
  );

  return { path: dataPackPath, manifest, files };
}
