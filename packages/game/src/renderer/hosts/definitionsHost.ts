import type { DefinitionsHost } from '@asteroid-miner/mod-sdk';

import { useDefinitionsStore } from '../stores/useDefinitionsStore';

export const createDefinitionsHost = (): DefinitionsHost => ({
  getDefinitions: () => useDefinitionsStore.getState().definitions,

  subscribe: (listener) =>
    useDefinitionsStore.subscribe((state) => listener(state.definitions)),
});

export const definitionsHost = createDefinitionsHost();
