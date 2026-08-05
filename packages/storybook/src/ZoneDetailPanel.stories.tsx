import type { Meta, StoryObj } from '@storybook/react-vite';

import { CrtScreen, ZoneDetailPanel } from '@asteroid-miner/ui';

const meta: Meta<typeof ZoneDetailPanel> = {
  title: 'Components/ZoneDetailPanel',
  component: ZoneDetailPanel,
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
type Story = StoryObj<typeof ZoneDetailPanel>;

export const LowLunarOrbit: Story = {
  args: {
    name: 'Low Lunar Orbit',
    description: 'Orbit around the Moon at low altitude.',
    labels: {
      contentsHeading: 'Contents',
      discoveredAsteroidCount: '2 discovered asteroids',
    },
  },
};
