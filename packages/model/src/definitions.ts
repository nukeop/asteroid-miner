import { z } from 'zod';

export const SkillModifierSchema = z.object({
  skill: z.string(),
  op: z.enum(['Flat', 'Factor']),
  value: z.number(),
});
export type SkillModifier = z.infer<typeof SkillModifierSchema>;

export const CustomEffectSchema = z.object({
  handler: z.string(),
  params: z.record(z.string(), z.unknown()),
});
export type CustomEffect = z.infer<typeof CustomEffectSchema>;

export const StartingBonusSchema = z.object({
  id: z.string(),
  amount: z.number(),
});
export type StartingBonus = z.infer<typeof StartingBonusSchema>;

export const EmbeddedResourceDefSchema = z.object({
  resource: z.string(),
  probability: z.number().min(0).max(1),
  minGrade: z.number().min(0).max(1),
  maxGrade: z.number().min(0).max(1),
});
export type EmbeddedResourceDef = z.infer<typeof EmbeddedResourceDefSchema>;

export const MassClassDefSchema = z.object({
  id: z.string(),
  nameKey: z.string(),
  minMass: z.number().positive(),
  maxMass: z.number().positive(),
  maxSites: z.number().int().min(1).max(100),
});
export type MassClassDef = z.infer<typeof MassClassDefSchema>;

export const WeightedFormationDefSchema = z.object({
  formation: z.string(),
  weight: z.number().positive(),
  depthBonus: z.number().optional(),
});
export type WeightedFormationDef = z.infer<typeof WeightedFormationDefSchema>;

export const CrewTemplateDefSchema = z.object({
  originsWhitelist: z.array(z.string()).optional(),
  careersWhitelist: z.array(z.string()).optional(),
  sex: z.enum(['Male', 'Female']).nullable(),
  age: z.tuple([z.number(), z.number()]),
  skills: z.record(z.string(), z.tuple([z.number(), z.number()])),
});
export type CrewTemplateDef = z.infer<typeof CrewTemplateDefSchema>;

export const NamePoolDefSchema = z.object({
  type: z.literal('namePool'),
  id: z.string(),
  maleFirst: z.array(z.string()).min(1),
  femaleFirst: z.array(z.string()).min(1),
  maleMiddle: z.array(z.string()).min(1),
  femaleMiddle: z.array(z.string()).min(1),
  maleLast: z.array(z.string()).min(1),
  femaleLast: z.array(z.string()).min(1),
});
export type NamePoolDef = z.infer<typeof NamePoolDefSchema>;

export const SkillDefSchema = z.object({
  type: z.literal('skill'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  xpBase: z.number(),
  xpGrowth: z.number(),
});
export type SkillDef = z.infer<typeof SkillDefSchema>;

export const TraitDefSchema = z.object({
  type: z.literal('trait'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  skillModifiers: z.array(SkillModifierSchema).optional(),
  customEffects: z.array(CustomEffectSchema).optional(),
});
export type TraitDef = z.infer<typeof TraitDefSchema>;

export const OriginDefSchema = z.object({
  type: z.literal('origin'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  skillBonuses: z.array(StartingBonusSchema),
});
export type OriginDef = z.infer<typeof OriginDefSchema>;

export const CareerDefSchema = z.object({
  type: z.literal('career'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  skillBonuses: z.array(StartingBonusSchema),
});
export type CareerDef = z.infer<typeof CareerDefSchema>;

export const TagDefSchema = z.object({
  type: z.literal('tag'),
  id: z.string(),
  nameKey: z.string(),
});
export type TagDef = z.infer<typeof TagDefSchema>;

export const ResourceDefSchema = z.object({
  type: z.literal('resource'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  tags: z.array(z.string()),
});
export type ResourceDef = z.infer<typeof ResourceDefSchema>;

export const FormationDefSchema = z.object({
  type: z.literal('formation'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  matrixResource: z.string(),
  embeddedResources: z.array(EmbeddedResourceDefSchema),
});
export type FormationDef = z.infer<typeof FormationDefSchema>;

export const AsteroidTypeDefSchema = z.object({
  type: z.literal('asteroidType'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  massClasses: z.array(MassClassDefSchema),
  formations: z.array(WeightedFormationDefSchema),
});
export type AsteroidTypeDef = z.infer<typeof AsteroidTypeDefSchema>;

const shipModuleBase = {
  type: z.literal('shipModule'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
};

export const ShipModuleDefSchema = z.discriminatedUnion('category', [
  z.object({ ...shipModuleBase, category: z.literal('bridge') }),
  z.object({ ...shipModuleBase, category: z.literal('reactor') }),
  z.object({
    ...shipModuleBase,
    category: z.literal('engine'),
    speed: z.number(),
    fuelEfficiency: z.number(),
  }),
  z.object({
    ...shipModuleBase,
    category: z.literal('fuelTank'),
    capacity: z.number(),
  }),
  z.object({ ...shipModuleBase, category: z.literal('crewQuarters') }),
  z.object({
    ...shipModuleBase,
    category: z.literal('cargoBay'),
    capacity: z.number(),
  }),
  z.object({
    ...shipModuleBase,
    category: z.literal('scanner'),
    sensitivity: z.number(),
  }),
  z.object({ ...shipModuleBase, category: z.literal('machineBay') }),
]);
export type ShipModuleDef = z.infer<typeof ShipModuleDefSchema>;

const machineBase = {
  type: z.literal('machine'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
};

export const MachineDefSchema = z.discriminatedUnion('category', [
  z.object({
    ...machineBase,
    category: z.literal('miningRig'),
    hopperCapacity: z.number(),
    maxExtractionRate: z.number(),
    crewSlots: z.number(),
  }),
  z.object({
    ...machineBase,
    category: z.literal('scanningRig'),
    accuracy: z.number(),
    crewSlots: z.number(),
  }),
]);
export type MachineDef = z.infer<typeof MachineDefSchema>;

export const ScenarioDefSchema = z.object({
  type: z.literal('scenario'),
  id: z.string(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  crew: z.array(CrewTemplateDefSchema),
});
export type ScenarioDef = z.infer<typeof ScenarioDefSchema>;

export const WeightedAsteroidTypeDefSchema = z.object({
  asteroidType: z.string(),
  weight: z.number().positive(),
});
export type WeightedAsteroidTypeDef = z.infer<
  typeof WeightedAsteroidTypeDefSchema
>;

export const AsteroidSpawnsDefSchema = z.object({
  density: z.number().nonnegative(),
  asteroidTypes: z.array(WeightedAsteroidTypeDefSchema).min(1),
});
export type AsteroidSpawnsDef = z.infer<typeof AsteroidSpawnsDefSchema>;

export const ZoneDefSchema = z.object({
  type: z.literal('zone'),
  id: z.string(),
  parentId: z.string().nullable(),
  nameKey: z.string(),
  descriptionKey: z.string(),
  edgeFromParent: z
    .object({
      deltaV: z.number().nonnegative(),
      days: z.number().nonnegative(),
    })
    .nullable(),
  asteroidSpawns: AsteroidSpawnsDefSchema.optional(),
});
export type ZoneDef = z.infer<typeof ZoneDefSchema>;

export const AnyDefSchema = z.discriminatedUnion('type', [
  SkillDefSchema,
  TraitDefSchema,
  OriginDefSchema,
  CareerDefSchema,
  TagDefSchema,
  ResourceDefSchema,
  FormationDefSchema,
  AsteroidTypeDefSchema,
  ShipModuleDefSchema,
  MachineDefSchema,
  ScenarioDefSchema,
  ZoneDefSchema,
  NamePoolDefSchema,
]);
export type AnyDef = z.infer<typeof AnyDefSchema>;

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
  zones: Record<string, ZoneDef>;
  namePools: Record<string, NamePoolDef>;
};
