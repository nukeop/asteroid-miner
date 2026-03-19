import { create } from 'zustand';

type SkillDef = {
  id: string;
  name_key: string;
  description_key: string;
  xp_base: number;
  xp_growth: number;
};

type SkillModifier = {
  skill: string;
  op: 'Flat' | 'Factor';
  value: number;
};

type CustomEffect = {
  handler: string;
  params: Record<string, unknown>;
};

type TraitDef = {
  id: string;
  name_key: string;
  description_key: string;
  skill_modifiers: SkillModifier[];
  custom_effects: CustomEffect[];
};

type StartingBonus = {
  id: string;
  amount: number;
};

type OriginDef = {
  id: string;
  name_key: string;
  description_key: string;
  skill_bonuses: StartingBonus[];
};

type CareerDef = {
  id: string;
  name_key: string;
  description_key: string;
  skill_bonuses: StartingBonus[];
};

type TagDef = {
  id: string;
  name_key: string;
};

type ResourceDef = {
  id: string;
  name_key: string;
  description_key: string;
  tags: string[];
};

type EmbeddedResource = {
  resource: string;
  probability: number;
  min_grade: number;
  max_grade: number;
};

type FormationDef = {
  id: string;
  name_key: string;
  description_key: string;
  matrix_resource: string;
  embedded_resources: EmbeddedResource[];
};

type MassClass = {
  id: string;
  name_key: string;
  min_mass: number;
  max_mass: number;
  max_sites: number;
};

type WeightedFormation = {
  formation: string;
  weight: number;
  depth_bonus: number;
};

type AsteroidTypeDef = {
  id: string;
  name_key: string;
  description_key: string;
  mass_classes: MassClass[];
  formations: WeightedFormation[];
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
};

type DefinitionsState = {
  definitions: Definitions | null;
  setDefinitions: (defs: Definitions) => void;
};

export const useDefinitionsStore = create<DefinitionsState>()((set) => ({
  definitions: null,
  setDefinitions: (defs) => set({ definitions: defs }),
}));
