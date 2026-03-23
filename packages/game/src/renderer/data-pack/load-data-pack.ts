import type { Definitions, NamePool } from '@asteroid-miner/model';

export type DataPackFiles = {
  manifest: string;
  skills?: string;
  traits?: string;
  origins?: string;
  careers?: string;
  tags?: string;
  resources?: string;
  formations?: string;
  asteroidTypes?: string;
  shipModules?: string;
  machines?: string;
  names?: string;
  scenarios?: string;
};

function parseOrEmpty<T>(json: string | undefined): Record<string, T> {
  return json ? JSON.parse(json) : {};
}

const emptyNamePool: NamePool = {
  maleFirst: [],
  femaleFirst: [],
  maleMiddle: [],
  femaleMiddle: [],
  maleLast: [],
  femaleLast: [],
};

export function loadDataPack(files: DataPackFiles): Definitions {
  return {
    skills: parseOrEmpty(files.skills),
    traits: parseOrEmpty(files.traits),
    origins: parseOrEmpty(files.origins),
    careers: parseOrEmpty(files.careers),
    tags: parseOrEmpty(files.tags),
    resources: parseOrEmpty(files.resources),
    formations: parseOrEmpty(files.formations),
    asteroidTypes: parseOrEmpty(files.asteroidTypes),
    shipModules: parseOrEmpty(files.shipModules),
    machines: parseOrEmpty(files.machines),
    scenarios: parseOrEmpty(files.scenarios),
    namePool: files.names ? JSON.parse(files.names) : emptyNamePool,
  };
}
