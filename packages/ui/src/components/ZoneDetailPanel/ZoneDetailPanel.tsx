import { type ComponentProps, type FC } from 'react';

import { cn } from '../../utils';

export type ZoneDetailPanelLabels = {
  contentsHeading: string;
  discoveredAsteroidCount: string;
};

export type ZoneDetailPanelProps = {
  name: string;
  description: string;
  labels: ZoneDetailPanelLabels;
} & ComponentProps<'aside'>;

export const ZoneDetailPanel: FC<ZoneDetailPanelProps> = ({
  name,
  description,
  labels,
  className,
  ...props
}) => (
  <aside
    data-testid="zone-detail-panel"
    className={cn(
      'border-crt-muted bg-crt-surface text-crt-text w-80 border p-4',
      className,
    )}
    {...props}
  >
    <h3 className="text-lg">{name}</h3>
    <p className="mt-2 text-sm">{description}</p>

    <h5 className="mt-4 text-xs opacity-70">{labels.contentsHeading}</h5>
    <p className="mt-1 text-sm">{labels.discoveredAsteroidCount}</p>
  </aside>
);
