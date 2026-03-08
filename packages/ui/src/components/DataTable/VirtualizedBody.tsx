import type { Row, RowData } from '@tanstack/react-table';
import type { VirtualItem } from '@tanstack/react-virtual';
import { memo } from 'react';

type Props<T extends RowData> = {
  rows: Row<T>[];
  virtualItems: VirtualItem[];
  paddingTop: number;
  paddingBottom: number;
  colSpan: number;
  renderRow: (args: { row: Row<T>; virtual: VirtualItem }) => React.ReactNode;
};

function VirtualizedBodyInner<T extends RowData>({
  rows,
  virtualItems,
  paddingTop,
  paddingBottom,
  colSpan,
  renderRow,
}: Props<T>) {
  return (
    <tbody>
      {paddingTop > 0 && (
        <tr style={{ height: paddingTop }}>
          <td colSpan={colSpan} />
        </tr>
      )}
      {virtualItems.map((virtualRow) => {
        const row = rows[virtualRow.index];
        return renderRow({ row, virtual: virtualRow });
      })}
      {paddingBottom > 0 && (
        <tr style={{ height: paddingBottom }}>
          <td colSpan={colSpan} />
        </tr>
      )}
    </tbody>
  );
}

export const VirtualizedBody = memo(
  VirtualizedBodyInner,
) as typeof VirtualizedBodyInner;
