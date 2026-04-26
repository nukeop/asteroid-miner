import { z } from 'zod';

export const SkillModifierSchema = z
  .object({
    skill: z.string().describe('The skill ID this modifier targets.'),
    op: z
      .enum(['Flat', 'Factor'])
      .describe(
        'How the modifier value is applied. "Flat" adds a fixed amount. "Factor" multiplies by the value.',
      ),
    value: z.number().meta({
      description:
        'The modifier amount. For Flat, added directly. For Factor, used as a multiplier (e.g. 1.2 = +20%).',
      examples: [2.0, -1.0, 1.5],
    }),
  })
  .describe('A modifier applied to a specific skill.');
export type SkillModifier = z.infer<typeof SkillModifierSchema>;

export const CustomEffectSchema = z
  .object({
    handler: z
      .string()
      .min(1)
      .meta({
        description:
          'Name of the effect handler function that processes this effect.',
        examples: ['reduce_food_consumption', 'immune_to_vacuum'],
      }),
    params: z.record(z.string(), z.unknown()).meta({
      description:
        'Arbitrary key-value parameters passed to the handler. Structure depends on the handler.',
      examples: [{ factor: 0.8 }, { duration_hours: 24, severity: 'mild' }],
    }),
  })
  .describe('A scripted effect with a named handler and free-form parameters.');
export type CustomEffect = z.infer<typeof CustomEffectSchema>;

export const StartingBonusSchema = z
  .object({
    id: z.string().describe('The skill ID to apply the bonus to.'),
    amount: z.number().meta({
      description:
        'Number of skill levels to add (positive) or subtract (negative).',
      examples: [1, 2, -1],
    }),
  })
  .describe('A starting bonus applied to a specific skill.');
export type StartingBonus = z.infer<typeof StartingBonusSchema>;

export const EmbeddedResourceDefSchema = z
  .object({
    resource: z.string().describe('Resource ID.'),
    probability: z
      .number()
      .min(0)
      .max(1)
      .describe(
        'Chance this resource appears in a generated site (0.0 to 1.0).',
      ),
    minGrade: z
      .number()
      .min(0)
      .max(1)
      .describe('Minimum fraction of site mass this resource can occupy.'),
    maxGrade: z
      .number()
      .min(0)
      .max(1)
      .describe('Maximum fraction of site mass this resource can occupy.'),
  })
  .describe(
    'A resource mixed into a formation matrix. Sum of all maxGrade values in a formation must be <= 1.0.',
  );
export type EmbeddedResourceDef = z.infer<typeof EmbeddedResourceDefSchema>;

export const MassClassDefSchema = z
  .object({
    id: z
      .string()
      .describe('Identifier for this mass class within the asteroid type.'),
    nameKey: z.string().describe('i18n key for the display name.'),
    minMass: z.number().positive().describe('Minimum total mass in tons.'),
    maxMass: z.number().positive().describe('Maximum total mass in tons.'),
    maxSites: z
      .number()
      .int()
      .min(1)
      .max(100)
      .describe('Maximum number of mining sites.'),
  })
  .describe('A size category bracket for an asteroid type.');
export type MassClassDef = z.infer<typeof MassClassDefSchema>;

export const WeightedFormationDefSchema = z
  .object({
    formation: z.string().describe('Formation ID.'),
    weight: z.number().positive().describe('Base weight. Must be positive.'),
    depthBonus: z
      .number()
      .optional()
      .describe(
        'Added to weight per site depth level (0 = outermost). Effective weight = weight + depthBonus * depth. Formations with effective weight <= 0 are excluded at that depth.',
      ),
  })
  .describe('A formation with a weight for random selection.');
export type WeightedFormationDef = z.infer<typeof WeightedFormationDefSchema>;

export const CrewTemplateDefSchema = z
  .object({
    originsWhitelist: z
      .array(z.string())
      .optional()
      .describe(
        'If present, crew rolled from this template must have one of these origin IDs.',
      ),
    careersWhitelist: z
      .array(z.string())
      .optional()
      .describe(
        'If present, crew rolled from this template must have one of these career IDs.',
      ),
    sex: z
      .enum(['Male', 'Female'])
      .nullable()
      .describe('Fixed sex for the rolled crew member, or null to randomize.'),
    age: z
      .tuple([z.number(), z.number()])
      .describe('[min, max] age range for the rolled crew member.'),
    skills: z
      .record(z.string(), z.tuple([z.number(), z.number()]))
      .describe('Skill ID to [min, max] starting level range.'),
  })
  .describe('A template that rolls one crew member at scenario start.');
export type CrewTemplateDef = z.infer<typeof CrewTemplateDefSchema>;

export const NamePoolDefSchema = z
  .object({
    type: z.literal('namePool'),
    id: z.string().describe('Unique identifier for this name pool.'),
    maleFirst: z
      .array(z.string())
      .min(1)
      .describe('First names used for male crew.'),
    femaleFirst: z
      .array(z.string())
      .min(1)
      .describe('First names used for female crew.'),
    maleMiddle: z
      .array(z.string())
      .min(1)
      .describe('Middle names used for male crew.'),
    femaleMiddle: z
      .array(z.string())
      .min(1)
      .describe('Middle names used for female crew.'),
    maleLast: z
      .array(z.string())
      .min(1)
      .describe('Surnames used for male crew.'),
    femaleLast: z
      .array(z.string())
      .min(1)
      .describe('Surnames used for female crew.'),
  })
  .describe('Name arrays for crew generation.');
export type NamePoolDef = z.infer<typeof NamePoolDefSchema>;

export const SkillDefSchema = z
  .object({
    type: z.literal('skill'),
    id: z.string().meta({
      description: 'Unique identifier for this skill.',
      examples: ['base:drilling', 'base:navigation', 'base:geology'],
    }),
    nameKey: z.string().describe('i18n key for the display name.'),
    descriptionKey: z.string().describe('i18n key for the description.'),
    xpBase: z
      .number()
      .describe(
        'XP required to reach level 1. Higher levels multiply this by xpGrowth.',
      ),
    xpGrowth: z.number().meta({
      description:
        'Multiplier applied per level for the XP curve. Must be greater than 1.0 or XP requirements stay flat across levels.',
      examples: [1.3, 1.5, 2.0],
    }),
  })
  .describe(
    'A skill pawns can learn and improve. XP for level N = xpBase * xpGrowth^(N-1).',
  );
export type SkillDef = z.infer<typeof SkillDefSchema>;

export const TraitDefSchema = z
  .object({
    type: z.literal('trait'),
    id: z.string().meta({
      description: 'Unique identifier for this trait.',
      examples: ['base:steady_hand', 'base:deep_sleeper', 'base:born_pilot'],
    }),
    nameKey: z
      .string()
      .describe('i18n key for the display name shown on the pawn trait list.'),
    descriptionKey: z.string().describe('i18n key for the description.'),
    skillModifiers: z
      .array(SkillModifierSchema)
      .optional()
      .describe(
        "Adjustments this trait applies to a pawn's effective skill levels.",
      ),
    customEffects: z
      .array(CustomEffectSchema)
      .optional()
      .describe(
        "Scripted effects that don't fit the modifier system. Each entry names a handler function and passes arbitrary parameters to it.",
      ),
  })
  .describe(
    'A pawn trait that modifies skills or triggers custom gameplay effects.',
  );
export type TraitDef = z.infer<typeof TraitDefSchema>;

export const OriginDefSchema = z
  .object({
    type: z.literal('origin'),
    id: z.string().meta({
      description: 'Unique identifier for this origin.',
      examples: ['base:belt_colony', 'base:core_world', 'base:frontier'],
    }),
    nameKey: z.string().describe('i18n key for the display name.'),
    descriptionKey: z.string().describe('i18n key for the description.'),
    skillBonuses: z
      .array(StartingBonusSchema)
      .describe('Starting skill level bonuses granted by this origin.'),
  })
  .describe('Where a pawn grew up before appearing in the game.');
export type OriginDef = z.infer<typeof OriginDefSchema>;

export const CareerDefSchema = z
  .object({
    type: z.literal('career'),
    id: z.string().meta({
      description: 'Unique identifier for this career.',
      examples: ['base:belt_miner', 'base:navy_pilot', 'base:field_medic'],
    }),
    nameKey: z.string().describe('i18n key for the display name.'),
    descriptionKey: z.string().describe('i18n key for the description.'),
    skillBonuses: z
      .array(StartingBonusSchema)
      .describe('Starting skill level bonuses granted by this career.'),
  })
  .describe('What a pawn did professionally before appearing in the game.');
export type CareerDef = z.infer<typeof CareerDefSchema>;

export const TagDefSchema = z
  .object({
    type: z.literal('tag'),
    id: z.string().describe('Unique identifier for this tag.'),
    nameKey: z.string().describe('i18n key for the display name.'),
  })
  .describe('A tag for categorizing resources and other game objects.');
export type TagDef = z.infer<typeof TagDefSchema>;

export const ResourceDefSchema = z
  .object({
    type: z.literal('resource'),
    id: z.string().describe('Unique identifier for this resource.'),
    nameKey: z.string().describe('i18n key for the display name.'),
    descriptionKey: z.string().describe('i18n key for the description.'),
    tags: z.array(z.string()).describe('Tag IDs.'),
  })
  .describe('A mineable and tradeable resource.');
export type ResourceDef = z.infer<typeof ResourceDefSchema>;

export const FormationDefSchema = z
  .object({
    type: z.literal('formation'),
    id: z.string().describe('Unique identifier for this formation.'),
    nameKey: z.string().describe('i18n key for the display name.'),
    descriptionKey: z.string().describe('i18n key for the description.'),
    matrixResource: z.string().describe('Resource ID for the matrix rock.'),
    embeddedResources: z
      .array(EmbeddedResourceDefSchema)
      .describe(
        'Resources mixed into the matrix rock. Sum of all maxGrade values must be <= 1.0.',
      ),
  })
  .describe(
    'A geological formation made of matrix rock and embedded resources.',
  );
export type FormationDef = z.infer<typeof FormationDefSchema>;

export const AsteroidTypeDefSchema = z
  .object({
    type: z.literal('asteroidType'),
    id: z.string().describe('Unique identifier for this asteroid type.'),
    nameKey: z.string().describe('i18n key for the display name.'),
    descriptionKey: z.string().describe('i18n key for the description.'),
    massClasses: z
      .array(MassClassDefSchema)
      .describe(
        'Size categories for this asteroid type. Must have at least one entry.',
      ),
    formations: z
      .array(WeightedFormationDefSchema)
      .describe(
        'Weighted formation list. Weights are relative. Must have at least one entry.',
      ),
  })
  .describe('A top-level asteroid classification.');
export type AsteroidTypeDef = z.infer<typeof AsteroidTypeDefSchema>;

const shipModuleBase = {
  type: z.literal('shipModule'),
  id: z.string().describe('Unique identifier.'),
  nameKey: z.string().describe('i18n key for the display name.'),
  descriptionKey: z.string().describe('i18n key for the description.'),
};

export const ShipModuleDefSchema = z
  .discriminatedUnion('category', [
    z
      .object({ ...shipModuleBase, category: z.literal('bridge') })
      .describe('Command bridge. Mandatory, one per ship.'),
    z
      .object({ ...shipModuleBase, category: z.literal('reactor') })
      .describe('Ship reactor. Mandatory, one per ship.'),
    z
      .object({
        ...shipModuleBase,
        category: z.literal('engine'),
        speed: z.number().positive().describe('Ship speed.'),
        fuelEfficiency: z
          .number()
          .positive()
          .describe('Fuel efficiency rating.'),
      })
      .describe('Propulsion engine.'),
    z
      .object({
        ...shipModuleBase,
        category: z.literal('fuelTank'),
        capacity: z.number().positive().describe('Fuel capacity in tonnes.'),
      })
      .describe('Fuel storage tank.'),
    z
      .object({ ...shipModuleBase, category: z.literal('crewQuarters') })
      .describe('Crew quarters. Houses one crew member.'),
    z
      .object({
        ...shipModuleBase,
        category: z.literal('cargoBay'),
        capacity: z.number().positive().describe('Cargo capacity in tonnes.'),
      })
      .describe('Cargo hold for mined resources.'),
    z
      .object({
        ...shipModuleBase,
        category: z.literal('scanner'),
        sensitivity: z
          .number()
          .positive()
          .describe('Scanner sensitivity for detection formula.'),
      })
      .describe('Ship-mounted spectral scanner for asteroid discovery.'),
    z
      .object({ ...shipModuleBase, category: z.literal('machineBay') })
      .describe('Bay that holds one deployable machine.'),
  ])
  .describe(
    'A component that can be installed on a ship. Each module has a category that determines its fields.',
  );
export type ShipModuleDef = z.infer<typeof ShipModuleDefSchema>;

const machineBase = {
  type: z.literal('machine'),
  id: z.string().describe('Unique identifier.'),
  nameKey: z.string().describe('i18n key for the display name.'),
  descriptionKey: z.string().describe('i18n key for the description.'),
};

export const MachineDefSchema = z
  .discriminatedUnion('category', [
    z
      .object({
        ...machineBase,
        category: z.literal('miningRig'),
        hopperCapacity: z
          .number()
          .positive()
          .describe('Hopper capacity in tonnes.'),
        maxExtractionRate: z
          .number()
          .positive()
          .describe('Maximum extraction rate.'),
        crewSlots: z
          .number()
          .int()
          .min(1)
          .describe('Number of crew that can operate this rig.'),
      })
      .describe('Mining rig deployed to extract rock.'),
    z
      .object({
        ...machineBase,
        category: z.literal('scanningRig'),
        accuracy: z
          .number()
          .positive()
          .max(1)
          .describe('Survey accuracy in (0.0, 1.0].'),
        crewSlots: z
          .number()
          .int()
          .min(1)
          .describe('Number of crew that can operate this rig.'),
      })
      .describe(
        'Scanning rig deployed on an asteroid for detailed composition analysis.',
      ),
  ])
  .describe(
    'Deployable equipment that operates at a fixed location. Transported in ship machine bays.',
  );
export type MachineDef = z.infer<typeof MachineDefSchema>;

export const ScenarioDefSchema = z
  .object({
    type: z.literal('scenario'),
    id: z.string().describe('Unique identifier for this scenario.'),
    nameKey: z.string().describe('i18n key for the display name.'),
    descriptionKey: z.string().describe('i18n key for the description.'),
    crew: z
      .array(CrewTemplateDefSchema)
      .describe('Templates for the starting crew.'),
  })
  .describe('A starting scenario that defines initial game conditions.');
export type ScenarioDef = z.infer<typeof ScenarioDefSchema>;

export const WeightedAsteroidTypeDefSchema = z
  .object({
    asteroidType: z.string().describe('Asteroid type ID.'),
    weight: z
      .number()
      .positive()
      .describe('Relative weight. Must be positive.'),
  })
  .describe('An asteroid type with a weight for random selection.');
export type WeightedAsteroidTypeDef = z.infer<
  typeof WeightedAsteroidTypeDefSchema
>;

export const AsteroidSpawnsDefSchema = z
  .object({
    density: z
      .number()
      .nonnegative()
      .describe('Relative density of asteroids spawned in this zone.'),
    asteroidTypes: z
      .array(WeightedAsteroidTypeDefSchema)
      .min(1)
      .describe(
        'Weighted list of asteroid types that can spawn here. At least one entry.',
      ),
  })
  .describe('Configuration for asteroid spawning in a zone.');
export type AsteroidSpawnsDef = z.infer<typeof AsteroidSpawnsDefSchema>;

export const ZoneDefSchema = z
  .object({
    type: z.literal('zone'),
    id: z.string().describe('Unique identifier for this zone.'),
    nameKey: z.string().describe('i18n key for the display name.'),
    descriptionKey: z.string().describe('i18n key for the description.'),
    asteroidSpawns: AsteroidSpawnsDefSchema.optional().describe(
      'If present, asteroids spawn in this zone according to these rules.',
    ),
  })
  .describe('A node in the zone graph. An orbit, station, or other location.');
export type ZoneDef = z.infer<typeof ZoneDefSchema>;

export const ZoneConnectionDefSchema = z
  .object({
    type: z.literal('zoneConnection'),
    id: z.string().describe('Unique identifier for this connection.'),
    zones: z
      .tuple([z.string(), z.string()])
      .describe(
        'The two zones this connection joins. Order is not significant; traversal is symmetric.',
      ),
    deltaV: z
      .number()
      .nonnegative()
      .describe(
        'Delta-v cost of traversing this connection in either direction.',
      ),
    days: z
      .number()
      .nonnegative()
      .describe(
        'Travel time in days for traversing this connection in either direction.',
      ),
  })
  .describe(
    'An undirected edge between two zones with a symmetric traversal cost.',
  );
export type ZoneConnectionDef = z.infer<typeof ZoneConnectionDefSchema>;

export const AnyDefSchema = z
  .discriminatedUnion('type', [
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
    ZoneConnectionDefSchema,
    NamePoolDefSchema,
  ])
  .describe(
    'Any def that can appear in a data pack file. The "type" field discriminates between def kinds.',
  );
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
  zoneConnections: Record<string, ZoneConnectionDef>;
  namePools: Record<string, NamePoolDef>;
};
