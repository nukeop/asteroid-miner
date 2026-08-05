import { z } from 'zod';

import { AnyDefSchema, type AnyDef } from './definitions';

const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

export const DataPackTypeSchema = z
  .enum(['base', 'dlc', 'mod'])
  .describe(
    'What kind of data pack this is. "base" is the core game data. "dlc" is for official DLCs. "mod" is for mods.',
  );
export type DataPackType = z.infer<typeof DataPackTypeSchema>;

export const DataPackManifestContentsSchema = z
  .object({
    name: z
      .string()
      .describe(
        'Unique name for this data pack. Must be unique across all loaded packs.',
      ),
    dataPack: z
      .object({
        type: DataPackTypeSchema,
        files: z
          .array(z.string())
          .describe(
            'Paths to def files shipped by this pack, relative to the pack root.',
          ),
        gameVersion: z
          .string()
          .regex(SEMVER_REGEX, 'must be semver')
          .meta({
            description:
              'Minimum game version this pack requires. Semver (MAJOR.MINOR.PATCH).',
            examples: ['0.1.0', '1.0.0'],
          }),
        nameKey: z.string().describe('i18n key for the display name.'),
        descriptionKey: z.string().describe('i18n key for the description.'),
      })
      .describe('Data pack metadata.'),
  })
  .describe(
    'Manifest format for data packs. The base game, DLCs, and community mods all use this format.',
  );
export type DataPackManifestContents = z.infer<
  typeof DataPackManifestContentsSchema
>;

export const DataPackDefsFileSchema = z.array(AnyDefSchema);
export type DataPackDefsFile = AnyDef[];
