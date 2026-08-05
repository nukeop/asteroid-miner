import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import {
  CrtScreen,
  ZoneMap,
  type ZoneMapConnection,
  type ZoneMapZone,
} from '@asteroid-miner/ui';

const meta: Meta<typeof ZoneMap> = {
  title: 'Components/ZoneMap',
  component: ZoneMap,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CrtScreen>
        <Story />
      </CrtScreen>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ZoneMap>;

const zones: ZoneMapZone[] = [
  { id: 'base:leo', name: 'Low Earth Orbit', position: { x: 10, y: 75 } },
  {
    id: 'base:lunar_transfer_orbit',
    name: 'Lunar Transfer Orbit',
    position: { x: 35, y: 50 },
  },
  {
    id: 'base:high_lunar_orbit',
    name: 'High Lunar Orbit',
    position: { x: 60, y: 25 },
  },
  { id: 'base:llo', name: 'Low Lunar Orbit', position: { x: 85, y: 25 } },
];

const connections: ZoneMapConnection[] = [
  {
    id: 'base:leo__lunar_transfer_orbit',
    zoneIds: ['base:leo', 'base:lunar_transfer_orbit'],
    label: 'Δv 3.1 · 2d',
  },
  {
    id: 'base:high_lunar_orbit__lunar_transfer_orbit',
    zoneIds: ['base:high_lunar_orbit', 'base:lunar_transfer_orbit'],
    label: 'Δv 0.7 · 2d',
  },
  {
    id: 'base:high_lunar_orbit__llo',
    zoneIds: ['base:high_lunar_orbit', 'base:llo'],
    label: 'Δv 0.8 · 1d',
  },
];

export const CislunarSystem: Story = {
  render: () => {
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(
      'base:llo',
    );

    return (
      <div className="h-[600px] w-[800px]">
        <ZoneMap
          zones={zones}
          connections={connections}
          selectedZoneId={selectedZoneId}
          onSelectZone={setSelectedZoneId}
        />
      </div>
    );
  },
};
