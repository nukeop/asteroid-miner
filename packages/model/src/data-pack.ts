import { z } from 'zod';

import { AnyDefSchema, type AnyDef } from './definitions';
import type { Result } from './result';

const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

export type DataPackFile = {
  path: string;
  text: Result<string, Error>;
};

export type ParsedJsonFile<T> = {
  file: DataPackFile;
  contents: Result<T, string>;
};

export const DataPackManifestContentsSchema = z.object({
  dataPack: z.object({
    files: z.array(z.string()),
    gameVersion: z.string().regex(SEMVER_REGEX, 'must be semver'),
    nameKey: z.string(),
    descriptionKey: z.string(),
  }),
});
export type DataPackManifestContents = z.infer<
  typeof DataPackManifestContentsSchema
>;

export type DataPackManifest = ParsedJsonFile<DataPackManifestContents>;

export const DataPackDefsFileSchema = z.array(AnyDefSchema);
export type DataPackDefsFile = AnyDef[];

export type DataPack = {
  path: string;
  manifest: DataPackManifest;
  files: ParsedJsonFile<DataPackDefsFile>[];
};
