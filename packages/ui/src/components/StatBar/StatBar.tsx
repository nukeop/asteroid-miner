import { type ComponentProps, type FC } from 'react';

import { cn } from '../../utils';

export type StatBarProps = ComponentProps<'div'> & {
  label: string;
  value: number;
  max?: number;
};

export const StatBar: FC<StatBarProps> = ({
  label,
  value,
  max = 20,
  className,
  ...props
}) => (
  <div className={cn('flex items-center gap-3', className)} {...props}>
    <span className="text-amber-text w-36 shrink-0 text-sm">{label}</span>

    <div className="bg-amber-deep border-amber-text h-6 flex-1 border">
      <div
        className="bg-amber-text border-amber-screen flex h-full items-center justify-start border-t-2 border-b-2 border-l-2"
        style={{ width: `${(value / max) * 100}%` }}
      >
        <span
          className={cn('pl-1', {
            'text-amber-screen': value > 0,
          })}
        >
          {value}
        </span>
      </div>
    </div>
  </div>
);
