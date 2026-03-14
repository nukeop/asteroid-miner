import { create } from 'zustand';

type SkillDef = {
  id: string;
  name: string;
  description: string;
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
  name: string;
  description: string;
  skill_modifiers: SkillModifier[];
  custom_effects: CustomEffect[];
};

type StartingBonus = {
  id: string;
  amount: number;
};

type OriginDef = {
  id: string;
  name: string;
  description: string;
  skill_bonuses: StartingBonus[];
};

type CareerDef = {
  id: string;
  name: string;
  description: string;
  skill_bonuses: StartingBonus[];
};

export type Definitions = {
  skills: Record<string, SkillDef>;
  traits: Record<string, TraitDef>;
  origins: Record<string, OriginDef>;
  careers: Record<string, CareerDef>;
};

type DefinitionsState = {
  definitions: Definitions | null;
  setDefinitions: (defs: Definitions) => void;
};

export const useDefinitionsStore = create<DefinitionsState>()((set) => ({
  definitions: null,
  setDefinitions: (defs) => set({ definitions: defs }),
}));
