import { ModAPI } from '@asteroid-miner/mod-sdk';

import { definitionsHost } from './definitionsHost';
import { gameClockHost } from './gameClockHost';

export const createModAPI = () =>
  new ModAPI({
    gameClockHost,
    definitionsHost,
  });
