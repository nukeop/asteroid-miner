import type {
  AsteroidTypeDef,
  CareerDef,
  DataPackFiles,
  DataPackManifest,
  Definitions,
  FormationDef,
  MachineDef,
  NamePool,
  OriginDef,
  ResourceDef,
  ScenarioDef,
  ShipModuleDef,
  SkillDef,
  TagDef,
  TraitDef,
} from '@asteroid-miner/model';

export type { DataPackFiles };

const emptyNamePool: NamePool = {
  maleFirst: [],
  femaleFirst: [],
  maleMiddle: [],
  femaleMiddle: [],
  maleLast: [],
  femaleLast: [],
};

export class DataPack {
  readonly manifest: DataPackManifest;
  readonly definitions: Definitions;

  constructor(files: DataPackFiles) {
    this.manifest = JSON.parse(files.manifest);

    this.definitions = {
      skills: DataPack.parse<SkillDef>(files.skills),
      traits: DataPack.parse<TraitDef>(files.traits),
      origins: DataPack.parse<OriginDef>(files.origins),
      careers: DataPack.parse<CareerDef>(files.careers),
      tags: DataPack.parse<TagDef>(files.tags),
      resources: DataPack.parse<ResourceDef>(files.resources),
      formations: DataPack.parse<FormationDef>(files.formations),
      asteroidTypes: DataPack.parse<AsteroidTypeDef>(files.asteroidTypes),
      shipModules: DataPack.parse<ShipModuleDef>(files.shipModules),
      machines: DataPack.parse<MachineDef>(files.machines),
      scenarios: DataPack.parse<ScenarioDef>(files.scenarios),
      namePool: files.names ? JSON.parse(files.names) : emptyNamePool,
    };
  }

  private static parse<T>(json: string | undefined): Record<string, T> {
    if (!json) {
      return {};
    }
    return JSON.parse(json);
  }
}
