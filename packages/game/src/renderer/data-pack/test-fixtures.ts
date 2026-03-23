import type { DataPackFiles } from './load-data-pack';

export function testFiles(): DataPackFiles {
  return {
    manifest: JSON.stringify({
      id: 'test',
      nameKey: 'pack.test.name',
      version: '1.0.0',
      type: 'base',
      descriptionKey: 'pack.test.description',
      author: 'test',
      gameVersion: '0.1.0',
    }),
    skills: JSON.stringify([
      {
        id: 'mining',
        nameKey: 'skill.mining.name',
        descriptionKey: 'skill.mining.description',
        xpBase: 100,
        xpGrowth: 1.5,
      },
    ]),
    traits: JSON.stringify([
      {
        id: 'tough',
        nameKey: 'trait.tough.name',
        descriptionKey: 'trait.tough.description',
        skillModifiers: [{ skill: 'mining', op: 'Flat', value: 5 }],
        customEffects: [{ handler: 'test_handler', params: { strength: 2 } }],
      },
    ]),
    origins: JSON.stringify([
      {
        id: 'belter',
        nameKey: 'origin.belter.name',
        descriptionKey: 'origin.belter.description',
        skillBonuses: [{ id: 'mining', amount: 3 }],
      },
    ]),
    careers: JSON.stringify([
      {
        id: 'miner',
        nameKey: 'career.miner.name',
        descriptionKey: 'career.miner.description',
        skillBonuses: [{ id: 'mining', amount: 2 }],
      },
    ]),
    tags: JSON.stringify([{ id: 'fuel', nameKey: 'tag.fuel.name' }]),
    resources: JSON.stringify([
      {
        id: 'coal',
        nameKey: 'resource.coal.name',
        descriptionKey: 'resource.coal.description',
        tags: ['fuel'],
      },
    ]),
    formations: JSON.stringify([
      {
        id: 'coal_sandstone',
        nameKey: 'formation.coal_sandstone.name',
        descriptionKey: 'formation.coal_sandstone.description',
        matrixResource: 'sandstone',
        embeddedResources: [
          {
            resource: 'coal',
            probability: 1.0,
            minGrade: 0.02,
            maxGrade: 0.1,
          },
        ],
      },
    ]),
    asteroidTypes: JSON.stringify([
      {
        id: 'c_type',
        nameKey: 'asteroid_type.c_type.name',
        descriptionKey: 'asteroid_type.c_type.description',
        massClasses: [
          {
            id: 's',
            nameKey: 'mass_class.s.name',
            minMass: 5000,
            maxMass: 50000,
            maxSites: 1,
          },
        ],
        formations: [{ formation: 'coal_sandstone', weight: 5 }],
      },
    ]),
    shipModules: JSON.stringify([
      {
        id: 'bridge_basic',
        category: 'bridge',
        nameKey: 'ship_module.bridge_basic.name',
        descriptionKey: 'ship_module.bridge_basic.description',
      },
    ]),
    machines: JSON.stringify([
      {
        id: 'mining_rig_basic',
        category: 'miningRig',
        nameKey: 'machine.mining_rig_basic.name',
        descriptionKey: 'machine.mining_rig_basic.description',
        hopperCapacity: 100,
        maxExtractionRate: 100,
        crewSlots: 2,
      },
    ]),
    names: JSON.stringify({
      maleFirst: ['Ivan'],
      femaleFirst: ['Olga'],
      maleMiddle: ['Ivanovich'],
      femaleMiddle: ['Ivanovna'],
      maleLast: ['Petrov'],
      femaleLast: ['Petrova'],
    }),
    scenarios: JSON.stringify([
      {
        id: 'test',
        nameKey: 'scenario.test.name',
        descriptionKey: 'scenario.test.description',
        crew: [{ sex: null, age: [25, 40], skills: { mining: [5, 5] } }],
      },
    ]),
  };
}
