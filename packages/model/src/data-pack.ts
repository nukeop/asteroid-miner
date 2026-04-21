import { z } from 'zod';

import type { Result } from './result';

export type DataPackFile = {
  path: string;
  text: Result<string, Error>;
};

export const DataPackManifestContentsSchema = z.object({});
export type DataPackManifestContents = z.infer<
  typeof DataPackManifestContentsSchema
>;

export type DataPackManifest = {
  file: DataPackFile;
  contents: Result<DataPackManifestContents, string>;
};

export type DataPack = {
  path: string;
  manifest: DataPackManifest;
  files: DataPackFile[];
};
