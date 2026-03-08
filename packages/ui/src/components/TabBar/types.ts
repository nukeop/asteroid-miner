import type { ComponentProps } from 'react';

export type TabId =
  | 'map'
  | 'company'
  | 'market'
  | 'missions'
  | 'hiring'
  | 'rivals';

export type TabDefinition = {
  id: TabId;
  shortcut: string;
};

// TODO: Remove this hardcoded data when migrating to TanStack Router
export const TABS: TabDefinition[] = [
  { id: 'map', shortcut: '1' },
  { id: 'company', shortcut: '2' },
  { id: 'market', shortcut: '3' },
  { id: 'missions', shortcut: '4' },
  { id: 'hiring', shortcut: '5' },
  { id: 'rivals', shortcut: '6' },
];

export type TabBarLabels = Record<TabId, string>;

export type TabBarProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  labels: TabBarLabels;
} & Omit<ComponentProps<'nav'>, 'children'>;
