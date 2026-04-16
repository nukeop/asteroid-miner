export type SkillDef = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  xpBase: number;
  xpGrowth: number;
};

export type SkillModifier = {
  skill: string;
  op: 'Flat' | 'Factor';
  value: number;
};

export type CustomEffect = {
  handler: string;
  params: Record<string, unknown>;
};

export type TraitDef = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  skillModifiers?: SkillModifier[];
  customEffects?: CustomEffect[];
};

export type StartingBonus = {
  id: string;
  amount: number;
};

export type OriginDef = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  skillBonuses: StartingBonus[];
};

export type CareerDef = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  skillBonuses: StartingBonus[];
};

export type TagDef = {
  id: string;
  nameKey: string;
};

export type ResourceDef = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  tags: string[];
};

export type EmbeddedResource = {
  resource: string;
  probability: number;
  minGrade: number;
  maxGrade: number;
};

export type FormationDef = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  matrixResource: string;
  embeddedResources: EmbeddedResource[];
};

export type MassClass = {
  id: string;
  nameKey: string;
  minMass: number;
  maxMass: number;
  maxSites: number;
};

export type WeightedFormation = {
  formation: string;
  weight: number;
  depthBonus?: number;
};

export type AsteroidTypeDef = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  massClasses: MassClass[];
  formations: WeightedFormation[];
};

type ShipModuleBase = {
  id: string;
  nameKey: string;
  descriptionKey: string;
};

export type ShipModuleDef =
  | (ShipModuleBase & { category: 'bridge' })
  | (ShipModuleBase & { category: 'reactor' })
  | (ShipModuleBase & {
      category: 'engine';
      speed: number;
      fuelEfficiency: number;
    })
  | (ShipModuleBase & { category: 'fuelTank'; capacity: number })
  | (ShipModuleBase & { category: 'crewQuarters' })
  | (ShipModuleBase & { category: 'cargoBay'; capacity: number })
  | (ShipModuleBase & { category: 'scanner'; sensitivity: number })
  | (ShipModuleBase & { category: 'machineBay' });

type MachineBase = {
  id: string;
  nameKey: string;
  descriptionKey: string;
};

export type MachineDef =
  | (MachineBase & {
      category: 'miningRig';
      hopperCapacity: number;
      maxExtractionRate: number;
      crewSlots: number;
    })
  | (MachineBase & {
      category: 'scanningRig';
      accuracy: number;
      crewSlots: number;
    });

export type CrewTemplate = {
  originsWhitelist?: string[];
  careersWhitelist?: string[];
  sex: 'Male' | 'Female' | null;
  age: [number, number];
  skills: Record<string, [number, number]>;
};

export type ScenarioDef = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  crew: CrewTemplate[];
};

export type NamePool = {
  maleFirst: string[];
  femaleFirst: string[];
  maleMiddle: string[];
  femaleMiddle: string[];
  maleLast: string[];
  femaleLast: string[];
};

export type Definitions = {
  skills: Record<string, SkillDef>;
  traits: Record<string, TraitDef>;
  origins: Record<string, OriginDef>;
  careers: Record<string, CareerDef>;
  tags: Record<string, TagDef>;
  resources: Record<string, ResourceDef>;
  formations: Record<string, FormationDef>;
  asteroidTypes: Record<string, AsteroidTypeDef>;
  shipModules: Record<string, ShipModuleDef>;
  machines: Record<string, MachineDef>;
  scenarios: Record<string, ScenarioDef>;
  namePool: NamePool;
};
