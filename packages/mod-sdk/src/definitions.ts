export type SkillDef = {
  id: string;
  name_key: string;
  description_key: string;
  xp_base: number;
  xp_growth: number;
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
  name_key: string;
  description_key: string;
  skill_modifiers: SkillModifier[];
  custom_effects: CustomEffect[];
};

export type StartingBonus = {
  id: string;
  amount: number;
};

export type OriginDef = {
  id: string;
  name_key: string;
  description_key: string;
  skill_bonuses: StartingBonus[];
};

export type CareerDef = {
  id: string;
  name_key: string;
  description_key: string;
  skill_bonuses: StartingBonus[];
};

export type TagDef = {
  id: string;
  name_key: string;
};

export type ResourceDef = {
  id: string;
  name_key: string;
  description_key: string;
  tags: string[];
};

export type EmbeddedResource = {
  resource: string;
  probability: number;
  min_grade: number;
  max_grade: number;
};

export type FormationDef = {
  id: string;
  name_key: string;
  description_key: string;
  matrix_resource: string;
  embedded_resources: EmbeddedResource[];
};

export type MassClass = {
  id: string;
  name_key: string;
  min_mass: number;
  max_mass: number;
  max_sites: number;
};

export type WeightedFormation = {
  formation: string;
  weight: number;
  depth_bonus: number;
};

export type AsteroidTypeDef = {
  id: string;
  name_key: string;
  description_key: string;
  mass_classes: MassClass[];
  formations: WeightedFormation[];
};

type ShipModuleBase = {
  id: string;
  name_key: string;
  description_key: string;
};

export type ShipModuleDef =
  | (ShipModuleBase & { category: 'bridge' })
  | (ShipModuleBase & { category: 'reactor' })
  | (ShipModuleBase & {
      category: 'engine';
      speed: number;
      fuel_efficiency: number;
    })
  | (ShipModuleBase & { category: 'fuel_tank'; capacity: number })
  | (ShipModuleBase & { category: 'crew_quarters' })
  | (ShipModuleBase & { category: 'cargo_bay'; capacity: number })
  | (ShipModuleBase & { category: 'scanner'; sensitivity: number })
  | (ShipModuleBase & { category: 'machine_bay' });

type MachineBase = {
  id: string;
  name_key: string;
  description_key: string;
};

export type MachineDef =
  | (MachineBase & {
      category: 'mining_rig';
      hopper_capacity: number;
      max_extraction_rate: number;
      crew_slots: number;
    })
  | (MachineBase & {
      category: 'scanning_rig';
      accuracy: number;
      crew_slots: number;
    });

export type CrewTemplate = {
  origins_whitelist: string[];
  careers_whitelist: string[];
  sex: 'Male' | 'Female' | null;
  age: [number, number];
  skills: Record<string, [number, number]>;
};

export type ScenarioDef = {
  id: string;
  name_key: string;
  description_key: string;
  crew: CrewTemplate[];
};

export type NamePool = {
  male_first: string[];
  female_first: string[];
  male_middle: string[];
  female_middle: string[];
  male_last: string[];
  female_last: string[];
};

export type Definitions = {
  skills: Record<string, SkillDef>;
  traits: Record<string, TraitDef>;
  origins: Record<string, OriginDef>;
  careers: Record<string, CareerDef>;
  tags: Record<string, TagDef>;
  resources: Record<string, ResourceDef>;
  formations: Record<string, FormationDef>;
  asteroid_types: Record<string, AsteroidTypeDef>;
  ship_modules: Record<string, ShipModuleDef>;
  machines: Record<string, MachineDef>;
  scenarios: Record<string, ScenarioDef>;
  name_pool: NamePool;
};
