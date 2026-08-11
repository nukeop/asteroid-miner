import type { Ship, StartingShipDef } from '@asteroid-miner/model';

export function instantiateShip(spec: StartingShipDef): Ship {
  return {
    id: crypto.randomUUID(),
    name: spec.name,
    hullId: spec.hullId,
    zoneId: spec.startingZoneId,
    modules: spec.moduleIds.map((defId) => ({
      id: crypto.randomUUID(),
      defId,
    })),
    machines: spec.machineIds.map((defId) => ({
      id: crypto.randomUUID(),
      defId,
    })),
  };
}
