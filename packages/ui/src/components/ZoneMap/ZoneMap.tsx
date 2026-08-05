import { type ComponentProps, type FC } from 'react';

import { cn } from '../../utils';
import { ZoneLink } from './ZoneLink';
import { ZoneNode } from './ZoneNode';

export type ZoneMapZone = {
  id: string;
  name: string;
  position: { x: number; y: number };
};

export type ZoneMapConnection = {
  id: string;
  zoneIds: [string, string];
  label: string;
};

export type ZoneMapProps = {
  zones: ZoneMapZone[];
  connections: ZoneMapConnection[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
} & ComponentProps<'svg'>;

export const ZoneMap: FC<ZoneMapProps> = ({
  zones,
  connections,
  selectedZoneId,
  onSelectZone,
  className,
  ...props
}) => {
  const zonesById = new Map(zones.map((zone) => [zone.id, zone]));

  const renderableConnections = connections.flatMap((connection) => {
    const [fromId, toId] = connection.zoneIds;
    const from = zonesById.get(fromId);
    const to = zonesById.get(toId);

    if (!from || !to) {
      return [];
    }

    return [{ connection, from, to }];
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('h-full w-full', className)}
      {...props}
    >
      {renderableConnections.map(({ connection, from, to }) => (
        <ZoneLink
          key={connection.id}
          from={from.position}
          to={to.position}
          label={connection.label}
        />
      ))}

      {zones.map((zone) => (
        <ZoneNode
          key={zone.id}
          zone={zone}
          isSelected={zone.id === selectedZoneId}
          onClick={() => onSelectZone(zone.id)}
        />
      ))}
    </svg>
  );
};
