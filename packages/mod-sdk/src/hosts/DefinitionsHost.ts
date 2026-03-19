import type { Definitions } from '../definitions';

export type DefinitionsHost = {
  getDefinitions(): Definitions | null;
  subscribe(listener: (definitions: Definitions | null) => void): () => void;
};
