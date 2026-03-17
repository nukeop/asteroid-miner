import { RussianRubleIcon } from 'lucide-react';
import { type ComponentProps, type FC } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button/Button';

export type TopBarLabels = {
  day: string;
  credits: string;
  advanceDay: string;
};

export type TopBarProps = {
  companyName: string;
  labels: TopBarLabels;
  onAdvanceDay: () => void;
} & Omit<ComponentProps<'header'>, 'children'>;

export const TopBar: FC<TopBarProps> = ({
  companyName,
  labels,
  onAdvanceDay,
  className,
  ...props
}) => (
  <header
    className={cn(
      'border-amber-dim bg-amber-screen flex h-10 items-center border-b pl-4',
      className,
    )}
    style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    {...props}
  >
    <span className="font-heading text-amber-text w-48 text-xs tracking-widest uppercase">
      {companyName}
    </span>

    <div className="flex flex-1 items-center justify-center gap-3">
      <span className="text-amber-text text-sm tracking-wide">
        {labels.credits}
        <RussianRubleIcon size={12} className="ml-1 inline" />
      </span>
      <span className="text-amber-dim">|</span>
      <span
        data-testid="top-bar-date"
        className="text-amber-text text-sm tracking-wide"
      >
        {labels.day}
      </span>
    </div>

    <Button
      variant="primary"
      onClick={onAdvanceDay}
      className="h-full w-48 rounded-none text-xs"
      style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
    >
      {labels.advanceDay}
    </Button>
  </header>
);
