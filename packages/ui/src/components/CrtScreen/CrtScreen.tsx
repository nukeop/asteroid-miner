import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '../../utils';

import './CrtScreen.css';

type Palette = 'amber' | 'green';

type CrtScreenProps = HTMLAttributes<HTMLDivElement> & {
  palette?: Palette;
  children?: ReactNode;
};

const paletteConfig: Record<
  Palette,
  { classes: string; vars: Record<string, string> }
> = {
  amber: {
    classes: 'bg-amber-screen text-amber-text',
    vars: {
      '--crt-text': 'var(--color-amber-text)',
      '--crt-glow': 'var(--color-amber-glow)',
      '--crt-screen': 'var(--color-amber-screen)',
      '--crt-dim': 'var(--color-amber-dim)',
    },
  },
  green: {
    classes: 'bg-green-screen text-green-text',
    vars: {
      '--crt-text': 'var(--color-green-text)',
      '--crt-glow': 'var(--color-green-bright)',
      '--crt-screen': 'var(--color-green-screen)',
      '--crt-dim': 'var(--color-green-dim)',
    },
  },
};

const CrtScreen = forwardRef<HTMLDivElement, CrtScreenProps>(
  ({ palette = 'amber', children, className, style, ...rest }, ref) => {
    const config = paletteConfig[palette];

    return (
      <div
        ref={ref}
        className={cn(
          'crt-screen relative overflow-hidden rounded-lg',
          config.classes,
          className,
        )}
        style={{ ...config.vars, ...style } as CSSProperties}
        {...rest}
      >
        <div className="crt-content relative z-[1] p-4">{children}</div>
      </div>
    );
  },
);

export { CrtScreen };
export type { CrtScreenProps };
