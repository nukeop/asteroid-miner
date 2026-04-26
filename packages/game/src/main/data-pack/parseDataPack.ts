import { join } from 'node:path';

import {
  DataPackDefsFileSchema,
  DataPackManifestContentsSchema,
  type DataPack,
} from '@asteroid-miner/model';

import { loadAndParseJson } from '../loadAndParseJson';

const MANIFEST_FILENAME = 'package.json';

export async function parseDataPack(dataPackPath: string): Promise<DataPack> {
  const manifest = await loadAndParseJson(
    join(dataPackPath, MANIFEST_FILENAME),
    DataPackManifestContentsSchema,
  );

  if (!manifest.contents.ok) {
    return { path: dataPackPath, manifest, files: [] };
  }

  const files = await Promise.all(
    manifest.contents.value.dataPack.files.map((relativePath) =>
      loadAndParseJson(
        join(dataPackPath, relativePath),
        DataPackDefsFileSchema,
      ),
    ),
  );

  return { path: dataPackPath, manifest, files };
}
