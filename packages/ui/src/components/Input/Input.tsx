import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../utils';

const inputVariants = cva(
  'bg-amber-deep text-amber-text border-amber-dim placeholder:text-amber-dim focus:border-amber-text w-full border px-3 font-mono transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-7 text-sm',
        md: 'h-9 text-sm',
        lg: 'h-12 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  VariantProps<typeof inputVariants>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

export { Input, inputVariants };
export type { InputProps };
