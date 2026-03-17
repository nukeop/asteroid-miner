import { GameClockAPI } from './api/GameClockAPI';
import type { GameClockHost } from './hosts/GameClockHost';

export class ModAPI {
  readonly gameClock: GameClockAPI;

  constructor(opts?: { gameClockHost?: GameClockHost }) {
    this.gameClock = new GameClockAPI(opts?.gameClockHost);
  }
}
