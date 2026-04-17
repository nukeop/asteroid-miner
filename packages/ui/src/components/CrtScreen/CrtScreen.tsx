import { type ComponentProps, type FC } from 'react';

import { cn } from '../../utils';

export type CrtScreenProps = ComponentProps<'div'>;

export const CrtScreen: FC<CrtScreenProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'crt-scanlines crt-flicker crt-vignette bg-crt-surface text-crt-text relative overflow-hidden rounded-lg',
      className,
    )}
    {...props}
  >
    <div className="relative z-1 p-4 blur-[0.3px]">{children}</div>
  </div>
);
