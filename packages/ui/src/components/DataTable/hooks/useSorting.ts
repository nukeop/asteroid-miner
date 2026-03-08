import type { SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export function useSorting(initial: SortingState = []) {
  const [sorting, setSorting] = useState<SortingState>(initial);
  const isSorted = useMemo(() => sorting.length > 0, [sorting]);

  return { sorting, setSorting, isSorted } as const;
}
