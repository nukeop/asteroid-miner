import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';

import { CrtScreen, DataTable } from '@asteroid-miner/ui';

type Asteroid = {
  id: string;
  name: string;
  type: string;
  mass: number;
  distance: number;
  value: number;
};

const columns: ColumnDef<Asteroid, unknown>[] = [
  { accessorKey: 'name', header: 'Designation' },
  { accessorKey: 'type', header: 'Class' },
  {
    accessorKey: 'mass',
    header: 'Mass (kt)',
    cell: ({ getValue }) => (getValue() as number).toLocaleString(),
  },
  {
    accessorKey: 'distance',
    header: 'Distance (AU)',
    cell: ({ getValue }) => (getValue() as number).toFixed(2),
  },
  {
    accessorKey: 'value',
    header: 'Est. Value (M¢)',
    cell: ({ getValue }) => (getValue() as number).toLocaleString(),
  },
];

const sampleData: Asteroid[] = [
  {
    id: '1',
    name: 'VX-448',
    type: 'M-type',
    mass: 12400,
    distance: 1.24,
    value: 8200,
  },
  {
    id: '2',
    name: 'KR-771',
    type: 'S-type',
    mass: 890,
    distance: 0.87,
    value: 340,
  },
  {
    id: '3',
    name: 'Pallas-9',
    type: 'C-type',
    mass: 45000,
    distance: 2.77,
    value: 15400,
  },
  {
    id: '4',
    name: 'TN-102',
    type: 'M-type',
    mass: 3200,
    distance: 1.58,
    value: 4100,
  },
  {
    id: '5',
    name: 'Juno-B',
    type: 'S-type',
    mass: 7800,
    distance: 3.12,
    value: 2900,
  },
  {
    id: '6',
    name: 'HX-339',
    type: 'X-type',
    mass: 560,
    distance: 0.44,
    value: 12800,
  },
  {
    id: '7',
    name: 'Ceres-IV',
    type: 'C-type',
    mass: 98000,
    distance: 2.99,
    value: 31000,
  },
  {
    id: '8',
    name: 'RM-55',
    type: 'M-type',
    mass: 1750,
    distance: 1.01,
    value: 6700,
  },
];

const generateLargeDataset = (count: number): Asteroid[] => {
  const types = ['M-type', 'S-type', 'C-type', 'X-type', 'V-type'];
  return Array.from({ length: count }, (_, i) => ({
    id: String(i),
    name: `AST-${String(i + 1).padStart(4, '0')}`,
    type: types[i % types.length],
    mass: Math.round(Math.random() * 100000),
    distance: Math.round(Math.random() * 500) / 100,
    value: Math.round(Math.random() * 50000),
  }));
};

const largeDataset = generateLargeDataset(5000);

const meta: Meta<typeof DataTable<Asteroid>> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTable<Asteroid>>;

export const Default: Story = {
  render: () => (
    <div className="bg-crt-bg p-8">
      <CrtScreen>
        <DataTable
          data={sampleData}
          columns={columns}
          classes={{ root: 'h-100' }}
        />
      </CrtScreen>
    </div>
  ),
};

export const NoHeader: Story = {
  render: () => (
    <div className="bg-crt-bg p-8">
      <CrtScreen>
        <DataTable
          data={sampleData.slice(0, 4)}
          columns={columns}
          features={{ header: false }}
          classes={{ root: 'h-100' }}
        />
      </CrtScreen>
    </div>
  ),
};

export const Virtualized: Story = {
  render: () => (
    <div className="bg-crt-bg p-8">
      <CrtScreen>
        <DataTable
          data={largeDataset}
          columns={columns}
          classes={{ root: 'h-100' }}
        />
      </CrtScreen>
    </div>
  ),
};
