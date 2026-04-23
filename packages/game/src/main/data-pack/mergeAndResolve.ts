import type { DataPack, Definitions } from '@asteroid-miner/model';

export type MergeResult = {
  definitions: Definitions;
  warnings: string[];
  errors: string[];
};

export function mergeAndResolve(_packs: DataPack[]): MergeResult {
  throw new Error('not implemented');
}
