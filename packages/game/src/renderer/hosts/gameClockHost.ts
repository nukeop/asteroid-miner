import type { GameClockHost } from '@asteroid-miner/mod-sdk';

import { useGameClockStore } from '../stores/useGameClockStore';

export const createGameClockHost = (): GameClockHost => ({
  getTurn: () => useGameClockStore.getState().turn,

  advanceDay: () => useGameClockStore.getState().advanceDay(),

  subscribe: (listener) =>
    useGameClockStore.subscribe((state) => listener(state.turn)),
});

export const gameClockHost = createGameClockHost();
