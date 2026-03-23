import type { Definitions } from '@asteroid-miner/model';

export type DataPackFiles = {
  manifest: string;
  skills: string;
  traits: string;
  origins: string;
  careers: string;
  tags: string;
  resources: string;
  formations: string;
  asteroidTypes: string;
  shipModules: string;
  machines: string;
  names: string;
  scenarios: string;
};

export function loadDataPack(_files: DataPackFiles): Definitions {
  throw new Error('Not implemented');
}
