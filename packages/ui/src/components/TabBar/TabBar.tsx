import { Link } from '@tanstack/react-router';
import { type FC } from 'react';

import { cn } from '../../utils';
import { type TabBarProps } from './types';

export const TabBar: FC<TabBarProps> = ({ tabs, className, ...props }) => (
  <nav
    className={cn('border-crt-muted bg-crt-surface flex border-b', className)}
    {...props}
  >
    {tabs.map((tab) => (
      <Link key={tab.id} to={tab.to} className="flex-1">
        {({ isActive }) => (
          <span
            aria-selected={isActive}
            role="tab"
            className={cn(
              'block cursor-pointer border-b-2 px-3 py-1.5 font-mono text-xs font-bold tracking-wide uppercase transition-colors',
              {
                'border-crt-text text-crt-text': isActive,
                'text-crt-muted hover:text-crt-text border-transparent':
                  !isActive,
              },
            )}
          >
            [{tab.shortcut}:{tab.label}]
          </span>
        )}
      </Link>
    ))}
  </nav>
);
