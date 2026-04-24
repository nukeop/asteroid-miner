import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import { DataPackManifestContentsSchema } from '../src/data-pack-schema';
import { AnyDefSchema } from '../src/definitions';

const thisDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(thisDir, '..', '..', '..');
const outDir = resolve(repoRoot, 'packages/game/data/schema');

const generatedComment =
  'This file is generated from Zod schemas in @asteroid-miner/model. Do not edit by hand. Run `pnpm --filter @asteroid-miner/model generate-schemas` to regenerate.';

type Target = {
  fileName: string;
  schema: z.ZodType;
};

const targets: Target[] = [
  { fileName: 'defs.schema.json', schema: AnyDefSchema },
  {
    fileName: 'pack-manifest.schema.json',
    schema: DataPackManifestContentsSchema,
  },
];

const writeTarget = async ({ fileName, schema }: Target): Promise<void> => {
  const jsonSchema = z.toJSONSchema(schema, { target: 'draft-2020-12' });
  const withComment = { $comment: generatedComment, ...jsonSchema };
  const outPath = resolve(outDir, fileName);
  await writeFile(
    outPath,
    `${JSON.stringify(withComment, null, 2)}\n`,
    'utf-8',
  );
  console.log(`wrote ${outPath}`);
};

async function main(): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await Promise.all(targets.map(writeTarget));
}

await main();
