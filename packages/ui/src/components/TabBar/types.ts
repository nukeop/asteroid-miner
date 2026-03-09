import type { ComponentProps } from 'react';

export type TabDefinition = {
  id: string;
  label: string;
  shortcut: string;
  to: string;
};

export type TabBarProps = {
  tabs: TabDefinition[];
} & Omit<ComponentProps<'nav'>, 'children'>;
