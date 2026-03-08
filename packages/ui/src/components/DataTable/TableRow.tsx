import type { Row, RowData } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { cn } from '../../utils';

type Props<T extends RowData> = {
  row: Row<T>;
  height: number;
  className?: string;
  cellClassName?: string;
  'data-index'?: number;
};

export function TableRow<T extends RowData>({
  row,
  height,
  className,
  cellClassName,
  ...props
}: Props<T>) {
  return (
    <tr
      role="row"
      className={className}
      style={{ height }}
      data-index={props['data-index']}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} role="cell" className={cn('px-2', cellClassName)}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}
