import { isEmpty, mapValues, random, sample } from 'lodash-es';

import type {
  CrewTemplate,
  Definitions,
  NamePool,
  Pawn,
} from '@asteroid-miner/model';

function pickFromWhitelistOrAll(
  whitelist: string[] | undefined,
  allKeys: string[],
): string {
  return sample(isEmpty(whitelist) ? allKeys : whitelist)!;
}

export function instantiatePawn(
  template: CrewTemplate,
  namePool: NamePool,
  defs: Definitions,
): Pawn {
  const sex = template.sex ?? sample(['Male', 'Female'] as const)!;

  const namesByGender = {
    Male: [namePool.maleFirst, namePool.maleMiddle, namePool.maleLast],
    Female: [namePool.femaleFirst, namePool.femaleMiddle, namePool.femaleLast],
  } as const;
  const [firsts, middles, lasts] = namesByGender[sex];

  return {
    id: crypto.randomUUID(),
    faction: '',
    firstName: sample(firsts)!,
    middleName: sample(middles)!,
    lastName: sample(lasts)!,
    nickname: null,
    age: random(template.age[0], template.age[1]),
    sex,
    origin: pickFromWhitelistOrAll(
      template.originsWhitelist,
      Object.keys(defs.origins),
    ),
    career: pickFromWhitelistOrAll(
      template.careersWhitelist,
      Object.keys(defs.careers),
    ),
    traits: [],
    skills: mapValues(template.skills, ([min, max]) => ({
      level: random(min, max),
      xp: 0,
    })),
  };
}
