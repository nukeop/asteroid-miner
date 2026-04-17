import { type FC, type ReactNode } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button/Button';

export type WizardLayoutLabels = {
  back: string;
  next: string;
  finish: string;
};

export type WizardLayoutProps = {
  labels: WizardLayoutLabels;
  isLastStep: boolean;
  nextDisabled?: boolean;
  onBack: () => void;
  onNext: () => void;
  children: ReactNode;
  'data-testid'?: string;
  className?: string;
};

export const WizardLayout: FC<WizardLayoutProps> = ({
  labels,
  isLastStep,
  nextDisabled,
  onBack,
  onNext,
  children,
  className = '',
  'data-testid': dataTestId,
}) => (
  <div
    className={cn('flex h-screen flex-col', className)}
    data-testid={dataTestId}
  >
    <div className="flex w-full flex-1 overflow-hidden">{children}</div>

    <div className="border-crt-muted flex justify-between border-t p-4">
      <Button variant="secondary" onClick={onBack}>
        {labels.back}
      </Button>
      <Button onClick={onNext} disabled={nextDisabled}>
        {isLastStep ? labels.finish : labels.next}
      </Button>
    </div>
  </div>
);
