import type {
  AnyDef,
  DataPack,
  Definitions,
  LoadResult,
} from '@asteroid-miner/model';

type BucketKey = keyof Definitions;

const bucketKeyByType: Record<AnyDef['type'], BucketKey> = {
  skill: 'skills',
  trait: 'traits',
  origin: 'origins',
  career: 'careers',
  tag: 'tags',
  resource: 'resources',
  formation: 'formations',
  asteroidType: 'asteroidTypes',
  shipModule: 'shipModules',
  machine: 'machines',
  scenario: 'scenarios',
  zone: 'zones',
  namePool: 'namePools',
};

const emptyDefinitions = (): Definitions => ({
  skills: {},
  traits: {},
  origins: {},
  careers: {},
  tags: {},
  resources: {},
  formations: {},
  asteroidTypes: {},
  shipModules: {},
  machines: {},
  scenarios: {},
  zones: {},
  namePools: {},
});

export function mergeAndResolve(_packs: DataPack[]): LoadResult<Definitions> {
  const value = emptyDefinitions();
  const warnings: string[] = [];
  const errors: string[] = [];

  return { value, warnings, errors };
}
