import { useVirtualizer } from '@tanstack/react-virtual';
import type { RefObject } from 'react';
import { useRef } from 'react';

export type UseVirtualRowsArgs = {
  count: number;
  rowHeight: number;
  overscan: number;
  scrollParentRef?: RefObject<HTMLDivElement | null>;
};

export function useVirtualRows({
  count,
  rowHeight,
  overscan,
  scrollParentRef: externalRef,
}: UseVirtualRowsArgs) {
  const internalRef = useRef<HTMLDivElement | null>(null);
  const scrollParentRef = externalRef ?? internalRef;

  const virtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count,
    estimateSize: () => rowHeight,
    getScrollElement: () => scrollParentRef.current,
    overscan,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
      : 0;

  return {
    scrollParentRef,
    virtualItems,
    paddingTop,
    paddingBottom,
    totalSize: virtualizer.getTotalSize(),
  } as const;
}
