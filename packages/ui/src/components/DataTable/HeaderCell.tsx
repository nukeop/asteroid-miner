import type { Header, RowData } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

import { cn } from '../../utils';

type Props<T extends RowData> = {
  header: Header<T, unknown>;
  className?: string;
};

export function HeaderCell<T extends RowData>({ header, className }: Props<T>) {
  const sorted = header.column.getIsSorted();
  const canSort = header.column.getCanSort();

  return (
    <th
      key={header.id}
      role="columnheader"
      className={cn(
        'text-left',
        canSort && 'cursor-pointer select-none',
        className,
      )}
      onClick={header.column.getToggleSortingHandler()}
      style={{ width: header.getSize() }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {sorted === 'asc' && (
        <ArrowUpIcon className="ml-1 inline-block h-4 w-4" aria-hidden />
      )}
      {sorted === 'desc' && (
        <ArrowDownIcon className="ml-1 inline-block h-4 w-4" aria-hidden />
      )}
    </th>
  );
}
