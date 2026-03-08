import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { TabBar, TopBar, type TabId } from '@asteroid-miner/ui';

const TAB_LABELS = {
  map: 'Map',
  company: 'Company',
  market: 'Market',
  missions: 'Missions',
  hiring: 'Hiring',
  rivals: 'Rivals',
} as const;

const meta: Meta = {
  title: 'Game/Layout',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const GameView: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState<TabId>('map');

    return (
      <div className="bg-amber-deep flex h-screen flex-col">
        <TopBar
          companyName="Kuiper Industrial"
          labels={{
            day: 'Day 47',
            credits: '12,450 CR',
          }}
        />
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          labels={TAB_LABELS}
        />

        <div className="flex flex-1 items-center justify-center">
          <span className="font-heading text-amber-dim text-2xl tracking-widest uppercase">
            {TAB_LABELS[activeTab]}
          </span>
        </div>
      </div>
    );
  },
};
