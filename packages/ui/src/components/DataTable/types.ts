import type { ColumnDef, RowData } from '@tanstack/react-table';

export type DataTableFeatures = {
  header?: boolean;
  sortable?: boolean;
};

export type DataTableClasses = {
  root?: string;
  header?: string;
  headerRow?: string;
  headerCell?: string;
  body?: string;
  row?: string;
  cell?: string;
};

export type DataTableProps<T extends RowData> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  features?: DataTableFeatures;
  classes?: DataTableClasses;
  getRowId?: (row: T, index: number) => string;
  rowHeight?: number;
  overscan?: number;
  'aria-label'?: string;
};
