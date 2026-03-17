import { ModAPI } from '@asteroid-miner/mod-sdk';

import { gameClockHost } from './gameClockHost';

export const createModAPI = () =>
  new ModAPI({
    gameClockHost,
  });
