import type { ModAPI } from '@asteroid-miner/mod-sdk';

import { createGameClockHost } from './gameClockHost';

export const createModAPI = (): ModAPI => ({
  gameClock: createGameClockHost(),
});
