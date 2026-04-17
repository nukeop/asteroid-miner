import { type ComponentProps, type FC, type ReactNode } from 'react';

import { cn } from '../../utils';
import { TabBar } from '../TabBar/TabBar';
import { type TabDefinition } from '../TabBar/types';
import { TopBar } from '../TopBar/TopBar';

export type GameShellProps = {
  topBar?: ReactNode;
  tabs?: TabDefinition[];
  children: ReactNode;
} & Omit<ComponentProps<'div'>, 'children'>;

export const GameShell: FC<GameShellProps> = ({
  topBar,
  tabs,
  children,
  className,
  ...props
}) => (
  <div
    className={cn(
      'crt-scanlines crt-flicker crt-vignette bg-crt-bg relative flex h-screen flex-col overflow-hidden',
      className,
    )}
    {...props}
  >
    <div className="relative z-3 flex flex-col">
      <TopBar>{topBar}</TopBar>
      {tabs && <TabBar tabs={tabs} />}
    </div>

    <main className="relative z-1 flex flex-1 items-center justify-center">
      {children}
    </main>
  </div>
);
