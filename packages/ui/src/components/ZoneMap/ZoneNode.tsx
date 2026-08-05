import { type FC } from 'react';

import { cn } from '../../utils';
import { type ZoneMapZone } from './ZoneMap';

export type ZoneNodeProps = {
  zone: ZoneMapZone;
  isSelected: boolean;
  onClick: () => void;
};

export const ZoneNode: FC<ZoneNodeProps> = ({ zone, isSelected, onClick }) => (
  <g
    role="button"
    aria-label={zone.name}
    onClick={onClick}
    className="group cursor-pointer"
  >
    {isSelected && (
      <circle
        cx={zone.position.x}
        cy={zone.position.y}
        r={4}
        className="stroke-crt-bright fill-none"
        strokeWidth={0.4}
      />
    )}
    <circle
      cx={zone.position.x}
      cy={zone.position.y}
      r={2.5}
      className={cn('stroke-crt-muted', {
        'fill-crt-bright': isSelected,
        'fill-crt-surface group-hover:fill-crt-muted': !isSelected,
      })}
      strokeWidth={0.4}
    />
    <text
      x={zone.position.x}
      y={zone.position.y + 6}
      textAnchor="middle"
      className={cn({
        'fill-crt-bright': isSelected,
        'fill-crt-text group-hover:fill-crt-bright': !isSelected,
      })}
      fontSize={2.4}
    >
      {zone.name}
    </text>
  </g>
);
