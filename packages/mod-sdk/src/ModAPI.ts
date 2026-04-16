import { DefinitionsAPI } from './api/DefinitionsAPI';
import { GameClockAPI } from './api/GameClockAPI';
import type { DefinitionsHost } from './hosts/DefinitionsHost';
import type { GameClockHost } from './hosts/GameClockHost';

export class ModAPI {
  readonly GameClock: GameClockAPI;
  readonly Definitions: DefinitionsAPI;

  constructor(opts?: {
    gameClockHost?: GameClockHost;
    definitionsHost?: DefinitionsHost;
  }) {
    this.GameClock = new GameClockAPI(opts?.gameClockHost);
    this.Definitions = new DefinitionsAPI(opts?.definitionsHost);
  }
}
