import { useState, type ComponentProps, type FC, type ReactNode } from 'react';

import { cn } from '../../utils';
import { TabBar } from '../TabBar/TabBar';
import { type TabBarLabels, type TabId } from '../TabBar/types';
import { TopBar, type TopBarLabels } from '../TopBar/TopBar';

export type GameShellLabels = {
  topBar: TopBarLabels;
  tabs: TabBarLabels;
};

export type GameShellProps = {
  companyName: string;
  labels: GameShellLabels;
  tabPanels?: Partial<Record<TabId, ReactNode>>;
} & Omit<ComponentProps<'div'>, 'children'>;

export const GameShell: FC<GameShellProps> = ({
  companyName,
  labels,
  tabPanels,
  className,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('map');

  return (
    <div
      className={cn(
        'crt-scanlines crt-flicker crt-vignette bg-amber-deep relative flex h-screen flex-col overflow-hidden',
        className,
      )}
      {...props}
    >
      <div className="relative z-3 flex flex-col">
        <TopBar companyName={companyName} labels={labels.topBar} />
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          labels={labels.tabs}
        />
      </div>

      <main className="relative z-1 flex flex-1 items-center justify-center">
        {tabPanels?.[activeTab] ?? (
          <span className="font-heading text-amber-dim text-2xl tracking-widest uppercase">
            {labels.tabs[activeTab]}
          </span>
        )}
      </main>
    </div>
  );
};
