import type { Definitions } from '@asteroid-miner/model';

export const testDefinitions: Definitions = {
  skills: {
    mining: {
      type: 'skill',
      id: 'mining',
      nameKey: 'skill.mining.name',
      descriptionKey: 'skill.mining.description',
      xpBase: 100,
      xpGrowth: 1.5,
    },
    geology: {
      type: 'skill',
      id: 'geology',
      nameKey: 'skill.geology.name',
      descriptionKey: 'skill.geology.description',
      xpBase: 100,
      xpGrowth: 1.5,
    },
    cosmonautics: {
      type: 'skill',
      id: 'cosmonautics',
      nameKey: 'skill.cosmonautics.name',
      descriptionKey: 'skill.cosmonautics.description',
      xpBase: 100,
      xpGrowth: 1.5,
    },
    navigation: {
      type: 'skill',
      id: 'navigation',
      nameKey: 'skill.navigation.name',
      descriptionKey: 'skill.navigation.description',
      xpBase: 100,
      xpGrowth: 1.5,
    },
    engineering: {
      type: 'skill',
      id: 'engineering',
      nameKey: 'skill.engineering.name',
      descriptionKey: 'skill.engineering.description',
      xpBase: 100,
      xpGrowth: 1.5,
    },
  },
  traits: {},
  origins: {
    civilian: {
      type: 'origin',
      id: 'civilian',
      nameKey: 'origin.civilian.name',
      descriptionKey: 'origin.civilian.description',
      skillBonuses: [],
    },
  },
  careers: {
    civilian: {
      type: 'career',
      id: 'civilian',
      nameKey: 'career.civilian.name',
      descriptionKey: 'career.civilian.description',
      skillBonuses: [],
    },
  },
  tags: {},
  resources: {},
  formations: {},
  asteroidTypes: {},
  shipModules: {},
  machines: {},
  zones: {},
  scenarios: {
    starting: {
      type: 'scenario',
      id: 'starting',
      nameKey: 'scenario.starting.name',
      descriptionKey: 'scenario.starting.description',
      crew: [
        {
          originsWhitelist: ['civilian'],
          careersWhitelist: ['civilian'],
          sex: null,
          age: [25, 40],
          skills: {
            mining: [6, 6],
            geology: [2, 2],
            cosmonautics: [1, 1],
          },
        },
        {
          originsWhitelist: ['civilian'],
          careersWhitelist: ['civilian'],
          sex: null,
          age: [25, 40],
          skills: {
            geology: [5, 5],
            cosmonautics: [2, 2],
            navigation: [1, 1],
          },
        },
        {
          originsWhitelist: ['civilian'],
          careersWhitelist: ['civilian'],
          sex: null,
          age: [28, 45],
          skills: {
            cosmonautics: [6, 6],
            navigation: [4, 4],
            engineering: [1, 1],
          },
        },
      ],
    },
  },
  namePools: {
    'base:default': {
      type: 'namePool',
      id: 'base:default',
      maleFirst: ['Ivan'],
      femaleFirst: ['Olga'],
      maleMiddle: ['Ivanovich'],
      femaleMiddle: ['Ivanovna'],
      maleLast: ['Petrov'],
      femaleLast: ['Petrova'],
    },
  },
};
