import { type ComponentProps, type FC } from 'react';

import { cn } from '../../utils';

export type TopBarLabels = {
  day: string;
  credits: string;
};

export type TopBarProps = {
  companyName: string;
  labels: TopBarLabels;
} & Omit<ComponentProps<'header'>, 'children'>;

export const TopBar: FC<TopBarProps> = ({
  companyName,
  labels,
  className,
  ...props
}) => (
  <header
    className={cn(
      'border-amber-dim bg-amber-screen flex h-10 items-center border-b px-4',
      className,
    )}
    {...props}
  >
    <span className="font-heading text-amber-bright text-xs tracking-widest uppercase">
      {companyName}
    </span>

    <span className="text-amber-dim flex-1 text-center text-xs tracking-wide">
      {labels.day}
    </span>

    <span className="crt-glow-amber text-amber-text text-sm tracking-wide">
      {labels.credits}
    </span>
  </header>
);
