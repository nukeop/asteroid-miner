import { type FC } from 'react';

import { cn } from '../../utils';
import { TABS, type TabBarProps } from './types';

export const TabBar: FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  labels,
  className,
  ...props
}) => (
  <nav
    className={cn('border-amber-dim bg-amber-screen flex border-b', className)}
    {...props}
  >
    {TABS.map(({ id, shortcut }) => {
      const isActive = id === activeTab;
      return (
        <button
          key={id}
          type="button"
          aria-selected={isActive}
          role="tab"
          className={cn(
            'flex-1 border-b-2 px-3 py-1.5 font-mono text-xs font-bold tracking-wide uppercase transition-colors',
            {
              'crt-glow-amber border-amber-text text-amber-text': isActive,
              'text-amber-dim hover:text-amber-text border-transparent':
                !isActive,
            },
          )}
          onClick={() => onTabChange(id)}
        >
          [{shortcut}:{labels[id]}]
        </button>
      );
    })}
  </nav>
);
