import { queryOptions } from '@tanstack/react-query';

import { DataPack } from '../data-pack/DataPack';
import { useDefinitionsStore } from './useDefinitionsStore';

async function loadDefinitions(packPath: string) {
  const result = await window.electronAPI.loadDataPack(packPath);

  if (!result.ok || !result.data) {
    throw new Error(result.error ?? 'Failed to load data pack');
  }

  const pack = new DataPack(result.data);
  useDefinitionsStore.getState().setDefinitions(pack.definitions);
  return pack.definitions;
}

export function dataPackQueryOptions(packPath: string) {
  return queryOptions({
    queryKey: ['dataPack', packPath],
    queryFn: () => loadDefinitions(packPath),
    staleTime: Infinity,
    retry: false,
  });
}
