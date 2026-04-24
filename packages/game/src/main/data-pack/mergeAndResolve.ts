import {
  partition,
  type AnyDef,
  type DataPack,
  type Definitions,
  type LoadResult,
} from '@asteroid-miner/model';

import { toLoadedPack } from './toLoadedPack';

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

export function mergeAndResolve(packs: DataPack[]): LoadResult<Definitions> {
  const value = emptyDefinitions();
  const warnings: string[] = [];

  const { oks: loadedPacks, errs } = partition(packs.map(toLoadedPack));
  const errors = errs.flat();

  const placements = loadedPacks.flatMap((pack) =>
    pack.files.flatMap((file) =>
      file.defs.map((def) => ({ def, packName: pack.name })),
    ),
  );

  placements.forEach(({ def }) => {
    const bucket = value[bucketKeyByType[def.type]];
    if (bucket[def.id]) {
      warnings.push(`Pack '${def.id.split(':')[0]}' overrides '${def.id}'`);
    }
    bucket[def.id] = def;
  });

  return { value, warnings, errors };
}
