import type { Definitions } from '../definitions';
import type { DefinitionsHost } from '../hosts/DefinitionsHost';

export class DefinitionsAPI {
  #host?: DefinitionsHost;

  constructor(host?: DefinitionsHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: DefinitionsHost) => T): T {
    if (!this.#host) {
      throw new Error('Definitions host not available');
    }
    return fn(this.#host);
  }

  getDefinitions(): Definitions | null {
    return this.#withHost((h) => h.getDefinitions());
  }

  subscribe(listener: (definitions: Definitions | null) => void) {
    return this.#withHost((h) => h.subscribe(listener));
  }
}
