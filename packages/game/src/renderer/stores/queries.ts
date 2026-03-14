import { queryOptions } from '@tanstack/react-query';

import { parseDataPack } from '../wasm';
import { useDefinitionsStore } from './useDefinitionsStore';

async function loadDataPack(packPath: string) {
  const result = await window.electronAPI.loadDataPack(packPath);

  if (!result.ok || !result.data) {
    throw new Error(result.error ?? 'Failed to load data pack');
  }

  const definitions = parseDataPack(result.data);
  useDefinitionsStore.getState().setDefinitions(definitions);
  return definitions;
}

export function dataPackQueryOptions(packPath: string) {
  return queryOptions({
    queryKey: ['dataPack', packPath],
    queryFn: () => loadDataPack(packPath),
    staleTime: Infinity,
    retry: false,
  });
}
