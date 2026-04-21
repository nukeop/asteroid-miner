import type { z } from 'zod';

import { err, ok, type Result } from '@asteroid-miner/model';

export function parseJsonWithSchema<T>(
  raw: string,
  schema: z.ZodType<T>,
): Result<T, string> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return err(`Invalid JSON: ${String(e)}`);
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    return err(result.error.message);
  }

  return ok(result.data);
}
