import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '../../utils';

const buttonVariants = cva(
  'border-border inline-flex cursor-pointer items-center justify-center border font-mono text-sm tracking-wide uppercase transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary/20 text-primary hover:bg-primary/30 hover:border-primary-hover shadow-sm',
        secondary:
          'bg-accent/20 text-accent hover:bg-accent/30 hover:border-accent-hover shadow-sm',
        ghost:
          'text-foreground-muted hover:text-foreground hover:bg-surface border-transparent bg-transparent',
      },
      size: {
        sm: 'h-7 rounded-sm px-3 text-xs',
        md: 'h-9 rounded-md px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
