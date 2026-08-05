import { readFile } from 'node:fs/promises';

import { err, ok, type Result } from '@asteroid-miner/model';

export async function readTextFile(
  path: string,
): Promise<Result<string, Error>> {
  try {
    const contents = await readFile(path, 'utf-8');
    return ok(contents);
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}
