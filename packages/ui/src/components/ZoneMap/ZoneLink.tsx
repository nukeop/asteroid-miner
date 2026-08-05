import { type FC } from 'react';

type ZoneLinkPosition = { x: number; y: number };

export type ZoneLinkProps = {
  from: ZoneLinkPosition;
  to: ZoneLinkPosition;
  label: string;
};

export const ZoneLink: FC<ZoneLinkProps> = ({ from, to, label }) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        className="stroke-crt-muted"
        strokeWidth={0.4}
      />
      <text
        x={midX}
        y={midY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-crt-text stroke-crt-bg"
        fontSize={2}
        strokeWidth={1}
        paintOrder="stroke"
      >
        {label}
      </text>
    </g>
  );
};
