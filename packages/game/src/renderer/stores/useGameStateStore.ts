import { keyBy, mapValues, omit } from 'lodash-es';
import { create } from 'zustand';

import type { GameState } from '@asteroid-miner/model';

import { instantiatePawn } from '../../simulation/crew';
import { instantiateShip } from '../../simulation/ship';
import { useDefinitionsStore } from './useDefinitionsStore';

type GameStateStore = {
  state: GameState | null;

  initGame: (scenarioId: string) => void;
  resetGame: () => void;
  rerollCrewMember: (templateIndex: number) => void;
  updateCrewMemberName: (
    pawnId: string,
    names: Partial<{
      firstName: string;
      middleName: string;
      lastName: string;
      nickname: string;
    }>,
  ) => void;
};

export const useGameStateStore = create<GameStateStore>()((set, get) => ({
  state: null,

  initGame: (scenarioId) => {
    const defs = useDefinitionsStore.getState().definitions!;
    const scenario = defs.scenarios[scenarioId];
    const pawns = scenario.crew.map((template) =>
      instantiatePawn(template, defs.namePools['base:default']!, defs),
    );
    const zones = mapValues(defs.zones, (zoneDef) => ({
      defId: zoneDef.id,
      asteroids: [],
    }));
    const ship = instantiateShip(scenario.ship);

    set({
      state: {
        scenarioId,
        defs,
        crew: keyBy(pawns, 'id'),
        crewOrder: pawns.map((p) => p.id),
        zones,
        ships: { [ship.id]: ship },
      },
    });
  },

  resetGame: () => set({ state: null }),

  rerollCrewMember: (templateIndex) => {
    const { state } = get();
    if (!state) {
      return;
    }

    const scenario = state.defs.scenarios[state.scenarioId];
    const template = scenario.crew[templateIndex];
    const newPawn = instantiatePawn(
      template,
      state.defs.namePools['base:default']!,
      state.defs,
    );

    const oldId = state.crewOrder[templateIndex];

    const crewOrder = [...state.crewOrder];
    crewOrder[templateIndex] = newPawn.id;

    set({
      state: {
        ...state,
        crew: { ...omit(state.crew, oldId), [newPawn.id]: newPawn },
        crewOrder,
      },
    });
  },

  updateCrewMemberName: (pawnId, names) => {
    const { state } = get();
    if (!state || !state.crew[pawnId]) {
      return;
    }

    set({
      state: {
        ...state,
        crew: {
          ...state.crew,
          [pawnId]: { ...state.crew[pawnId], ...names },
        },
      },
    });
  },
}));
