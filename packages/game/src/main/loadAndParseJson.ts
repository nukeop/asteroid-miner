import type { z } from 'zod';

import { err, type ParsedJsonFile } from '@asteroid-miner/model';

import { readTextFile } from './fs';
import { parseJsonWithSchema } from './json';

export async function loadAndParseJson<T>(
  path: string,
  schema: z.ZodType<T>,
): Promise<ParsedJsonFile<T>> {
  const text = await readTextFile(path);

  if (!text.ok) {
    return {
      file: { path, text },
      contents: err('Could not load file'),
    };
  }

  const contents = parseJsonWithSchema(text.value, schema);

  return {
    file: { path, text },
    contents,
  };
}
