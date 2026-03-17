import type { GameClockHost } from '../hosts/GameClockHost';

export class GameClockAPI {
  #host?: GameClockHost;

  constructor(host?: GameClockHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: GameClockHost) => T): T {
    if (!this.#host) {
      throw new Error('GameClock host not available');
    }
    return fn(this.#host);
  }

  getTurn() {
    return this.#withHost((h) => h.getTurn());
  }

  advanceDay() {
    return this.#withHost((h) => h.advanceDay());
  }

  subscribe(listener: (turn: number) => void) {
    return this.#withHost((h) => h.subscribe(listener));
  }
}
