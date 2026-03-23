import type { Definitions } from '@asteroid-miner/model';

export type DefinitionsHost = {
  getDefinitions(): Definitions | null;
  subscribe(listener: (definitions: Definitions | null) => void): () => void;
};
