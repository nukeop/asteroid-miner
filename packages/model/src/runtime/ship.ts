export type ShipModuleInstance = {
  id: string;
  defId: string;
};

export type MachineInstance = {
  id: string;
  defId: string;
};

export type Ship = {
  id: string;
  name: string;
  hullId: string;
  zoneId: string;
  modules: ShipModuleInstance[];
  machines: MachineInstance[];
};
