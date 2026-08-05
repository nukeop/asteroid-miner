import { useState, type FC } from 'react';

import { useTranslation, type TFunction } from '@asteroid-miner/i18n';
import type { Definitions } from '@asteroid-miner/model';
import {
  ZoneDetailPanel,
  ZoneMap,
  type ZoneMapConnection,
  type ZoneMapZone,
} from '@asteroid-miner/ui';

import { useGameStateStore } from '../stores/useGameStateStore';

function toZoneMapModel(
  defs: Definitions,
  t: TFunction,
): { zones: ZoneMapZone[]; connections: ZoneMapConnection[] } {
  const zones = Object.values(defs.zones).map((zoneDef) => ({
    id: zoneDef.id,
    name: t(zoneDef.nameKey),
    position: zoneDef.mapPosition,
  }));

  const connections = Object.values(defs.zoneConnections).map(
    (connectionDef) => ({
      id: connectionDef.id,
      zoneIds: connectionDef.zoneIds,
      label: t('map.connectionLabel', {
        deltaV: connectionDef.deltaV,
        days: connectionDef.days,
      }),
    }),
  );

  return { zones, connections };
}

export const MapView: FC = () => {
  const { t } = useTranslation();
  const state = useGameStateStore((s) => s.state)!;
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const { zones, connections } = toZoneMapModel(state.defs, t);
  const selectedZoneDef =
    selectedZoneId !== null ? state.defs.zones[selectedZoneId] : null;

  return (
    <div className="absolute inset-0 flex">
      <div className="flex-1">
        <ZoneMap
          zones={zones}
          connections={connections}
          selectedZoneId={selectedZoneId}
          onSelectZone={setSelectedZoneId}
        />
      </div>

      {selectedZoneDef && (
        <ZoneDetailPanel
          name={t(selectedZoneDef.nameKey)}
          description={t(selectedZoneDef.descriptionKey)}
          labels={{
            contentsHeading: t('map.contentsHeading'),
            discoveredAsteroidCount: t('map.discoveredAsteroidCount', {
              count: state.zones[selectedZoneDef.id].asteroids.length,
            }),
          }}
        />
      )}
    </div>
  );
};
