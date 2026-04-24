import { sortBy } from 'lodash-es';

import {
  partition,
  type AnyDef,
  type DataPack,
  type DataPackType,
  type Definitions,
  type LoadResult,
} from '@asteroid-miner/model';

import { toLoadedPack, type LoadedPack } from './toLoadedPack';

const packTypeRank: Record<DataPackType, number> = {
  base: 0,
  dlc: 1,
  mod: 2,
};

const sortPacks = (packs: LoadedPack[]): LoadedPack[] =>
  sortBy(packs, [(pack) => packTypeRank[pack.type], (pack) => pack.name]);

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

  const { oks: unsortedPacks, errs } = partition(packs.map(toLoadedPack));
  const errors = errs.flat();
  const loadedPacks = sortPacks(unsortedPacks);

  const placements = loadedPacks.flatMap((pack) =>
    pack.files.flatMap((file) =>
      file.defs.map((def) => ({ def, packName: pack.name })),
    ),
  );

  placements.forEach(({ def, packName }) => {
    const bucket = value[bucketKeyByType[def.type]];
    if (bucket[def.id]) {
      warnings.push(`Pack '${packName}' overrides '${def.id}'`);
    }
    bucket[def.id] = def;
  });

  return { value, warnings, errors };
}
