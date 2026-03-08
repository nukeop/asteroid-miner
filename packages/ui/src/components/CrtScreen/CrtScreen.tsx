import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps, type FC } from 'react';

import { cn } from '../../utils';

const screenVariants = cva(
  'crt-scanlines crt-flicker crt-vignette relative overflow-hidden rounded-lg',
  {
    variants: {
      palette: {
        amber: 'bg-amber-screen text-amber-text',
        green: 'bg-green-screen text-green-text',
      },
    },
    defaultVariants: {
      palette: 'amber',
    },
  },
);

const contentVariants = cva('relative z-1 p-4 blur-[0.3px]', {
  variants: {
    palette: {
      amber: 'crt-glow-amber',
      green: 'crt-glow-green',
    },
  },
  defaultVariants: {
    palette: 'amber',
  },
});

export type CrtScreenProps = ComponentProps<'div'> &
  VariantProps<typeof screenVariants>;

export const CrtScreen: FC<CrtScreenProps> = ({
  palette,
  className,
  children,
  ...props
}) => (
  <div className={cn(screenVariants({ palette, className }))} {...props}>
    <div className={contentVariants({ palette })}>{children}</div>
  </div>
);
