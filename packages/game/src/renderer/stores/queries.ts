import { queryOptions } from '@tanstack/react-query';

import { loadDataPack } from '../data-pack';
import { useDefinitionsStore } from './useDefinitionsStore';

async function loadDefinitions(packPath: string) {
  const result = await window.electronAPI.loadDataPack(packPath);

  if (!result.ok || !result.data) {
    throw new Error(result.error ?? 'Failed to load data pack');
  }

  const definitions = loadDataPack(result.data);
  useDefinitionsStore.getState().setDefinitions(definitions);
  return definitions;
}

export function dataPackQueryOptions(packPath: string) {
  return queryOptions({
    queryKey: ['dataPack', packPath],
    queryFn: () => loadDefinitions(packPath),
    staleTime: Infinity,
    retry: false,
  });
}
