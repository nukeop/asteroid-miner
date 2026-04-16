export type DataPackType = 'base' | 'dlc' | 'mod';

export type DataFileName =
  | 'skills'
  | 'traits'
  | 'origins'
  | 'careers'
  | 'tags'
  | 'resources'
  | 'formations'
  | 'asteroidTypes'
  | 'shipModules'
  | 'machines'
  | 'names'
  | 'scenarios';

export type DataPackMeta = {
  type: DataPackType;
  gameVersion: string;
  nameKey: string;
  descriptionKey: string;
  files: DataFileName[];
};

export type DataPackManifest = {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: Record<string, string>;
  asteroidMiner: DataPackMeta;
};

export type DataPackFiles = {
  manifest: string;
} & Partial<Record<DataFileName, string>>;
