import { keyBy, omit } from 'lodash-es';
import { create } from 'zustand';

import type { Definitions, Pawn } from '@asteroid-miner/model';

import { instantiatePawn } from '../../simulation/crew';
import { useDefinitionsStore } from './useDefinitionsStore';

type GameState = {
  scenarioId: string;
  defs: Definitions;
  crew: Record<string, Pawn>;
  crewOrder: string[];
};

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
      instantiatePawn(template, defs.namePool, defs),
    );

    set({
      state: {
        scenarioId,
        defs,
        crew: keyBy(pawns, 'id'),
        crewOrder: pawns.map((p) => p.id),
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
    const newPawn = instantiatePawn(template, state.defs.namePool, state.defs);

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
