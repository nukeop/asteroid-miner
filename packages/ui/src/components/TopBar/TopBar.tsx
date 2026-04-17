import { type ComponentProps, type FC, type ReactNode } from 'react';

import { cn } from '../../utils';

export type TopBarProps = {
  children?: ReactNode;
} & ComponentProps<'header'>;

export const TopBar: FC<TopBarProps> = ({ children, className, ...props }) => (
  <header
    className={cn(
      'border-crt-muted bg-crt-surface flex h-10 items-center border-b pl-4 [-webkit-app-region:drag]',
      className,
    )}
    {...props}
  >
    {children}
  </header>
);
