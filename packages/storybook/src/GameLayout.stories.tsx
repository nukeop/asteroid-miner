import type { Meta, StoryObj } from '@storybook/react-vite';

import { GameShell } from '@asteroid-miner/ui';

const meta: Meta<typeof GameShell> = {
  title: 'Game/Layout',
  component: GameShell,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof GameShell>;

export const GameView: Story = {
  args: {
    companyName: 'Kuiper Industrial',
    labels: {
      topBar: {
        day: 'Day 47',
        credits: '12,450 CR',
      },
      tabs: {
        map: 'Map',
        company: 'Company',
        market: 'Market',
        missions: 'Missions',
        hiring: 'Hiring',
        rivals: 'Rivals',
      },
    },
  },
};
