import type { RowData } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRef } from 'react';

import { cn } from '../../utils';
import {
  DEFAULT_OVERSCAN,
  DEFAULT_ROW_HEIGHT,
  defaultFeatures,
} from './constants';
import { useSorting } from './hooks/useSorting';
import { useVirtualRows } from './hooks/useVirtualRows';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import type { DataTableProps } from './types';
import { VirtualizedBody } from './VirtualizedBody';

export function DataTable<T extends RowData>({
  data,
  columns,
  features,
  classes,
  getRowId,
  rowHeight = DEFAULT_ROW_HEIGHT,
  overscan = DEFAULT_OVERSCAN,
  ...props
}: DataTableProps<T>) {
  const resolvedFeatures = { ...defaultFeatures, ...features };
  const { sorting, setSorting } = useSorting();

  const table = useReactTable({
    columns,
    data,
    state: { sorting },
    enableSorting: resolvedFeatures.sortable,
    enableSortingRemoval: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
  });

  const { rows } = table.getRowModel();
  const colCount = table.getVisibleFlatColumns().length;

  const scrollParentRef = useRef<HTMLDivElement | null>(null);
  const { virtualItems, paddingTop, paddingBottom } = useVirtualRows({
    count: rows.length,
    rowHeight,
    overscan,
    scrollParentRef,
  });

  return (
    <div
      ref={scrollParentRef}
      className={cn(
        'relative max-h-full w-full overflow-y-auto',
        classes?.root,
      )}
      aria-label={props['aria-label']}
    >
      <table role="table" className="w-full border-separate border-spacing-0">
        {resolvedFeatures.header && (
          <TableHeader
            headerGroups={table.getHeaderGroups()}
            classes={classes}
          />
        )}
        <VirtualizedBody
          rows={rows}
          virtualItems={virtualItems}
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
          colSpan={colCount}
          renderRow={({ row, virtual }) => (
            <TableRow
              key={row.id}
              row={row}
              height={rowHeight}
              className={classes?.row}
              cellClassName={classes?.cell}
              data-index={virtual.index}
            />
          )}
        />
      </table>
    </div>
  );
}
