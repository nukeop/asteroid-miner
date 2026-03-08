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
  { id: 'map', shortcut: 'F1' },
  { id: 'company', shortcut: 'F2' },
  { id: 'market', shortcut: 'F3' },
  { id: 'missions', shortcut: 'F4' },
  { id: 'hiring', shortcut: 'F5' },
  { id: 'rivals', shortcut: 'F6' },
];

export type TabBarLabels = Record<TabId, string>;

export type TabBarProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  labels: TabBarLabels;
} & Omit<ComponentProps<'nav'>, 'children'>;
