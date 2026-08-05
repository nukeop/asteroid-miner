import type {
  DataPackDefsFile,
  DataPackManifestContents,
} from './data-pack-schema';
import type { Result } from './result';

export type DataPackFile = {
  path: string;
  text: Result<string, Error>;
};

export type ParsedJsonFile<T> = {
  file: DataPackFile;
  contents: Result<T, string>;
};

export type DataPackManifest = ParsedJsonFile<DataPackManifestContents>;

export type DataPack = {
  path: string;
  manifest: DataPackManifest;
  files: ParsedJsonFile<DataPackDefsFile>[];
};
