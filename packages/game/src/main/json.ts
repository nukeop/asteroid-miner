import { z } from 'zod';

import { err, ok, type Result } from '@asteroid-miner/model';

export function parseJsonWithSchema<T>(
  raw: string,
  schema: z.ZodType<T>,
): Result<T, string> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return err(`Invalid JSON: ${message}`);
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    return err(z.prettifyError(result.error));
  }

  return ok(result.data);
}
