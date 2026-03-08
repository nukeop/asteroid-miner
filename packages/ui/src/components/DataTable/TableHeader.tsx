import type { HeaderGroup, RowData } from '@tanstack/react-table';

import { HeaderCell } from './HeaderCell';
import type { DataTableClasses } from './types';

type Props<T extends RowData> = {
  headerGroups: HeaderGroup<T>[];
  classes?: DataTableClasses;
};

export function TableHeader<T extends RowData>({
  headerGroups,
  classes,
}: Props<T>) {
  return (
    <thead className={classes?.header}>
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id} role="row" className={classes?.headerRow}>
          {headerGroup.headers.map((header) => (
            <HeaderCell
              key={header.id}
              header={header}
              className={classes?.headerCell}
            />
          ))}
        </tr>
      ))}
    </thead>
  );
}
