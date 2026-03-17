---
description: How game systems expose functionality to mods.
---

# Host pattern

How game systems expose functionality to mods.

## Modding SDK layers

Every game system the mod SDK supports follows the same three-layer structure:

1. **Host type** - the contract (mod-sdk, no implementation)
2. **API class** - what mods actually call (mod-sdk, wraps the host)
3. **Host implementation** - bridges the API to game internals (game package)

Mods call methods on an API class (e.g. `api.gameClock.getTurn()`), which holds a private reference to the host and delegates to it. Mods never touch a host directly.

## The three layers

### 1. Host type (`packages/mod-sdk/src/hosts/`)

A TypeScript `type` with no implementation. Defines what the game must provide for a domain.

```typescript
// hosts/GameClockHost.ts
export type GameClockHost = {
  getTurn(): number;
  advanceDay(): void;
  subscribe(listener: (turn: number) => void): () => void;
};
```

### 2. API class (`packages/mod-sdk/src/api/`)

The surface mods interact with. Holds an optional reference to the host and guards every call with `#withHost`, which throws if the host isn't present.

```typescript
// api/GameClockAPI.ts
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
}
```

All API classes are assembled into `ModAPI` in `packages/mod-sdk/src/ModAPI.ts`, which is what mods receive as their `api` object.

### 3. Host implementation (`packages/game/src/renderer/hosts/`)

Lives in the game package. Implements the host interface and bridges it to whatever backs the domain - a Zustand store, a provider registry, an Electron API, etc.

```typescript
// hosts/gameClockHost.ts
import type { GameClockHost } from '@asteroid-miner/mod-sdk';

import { useGameClockStore } from '../stores/useGameClockStore';

export const createGameClockHost = (): GameClockHost => ({
  getTurn: () => useGameClockStore.getState().turn,
  advanceDay: () => useGameClockStore.getState().advanceDay(),
  subscribe: (listener) =>
    useGameClockStore.subscribe((state) => listener(state.turn)),
});

export const gameClockHost = createGameClockHost();
```

The singleton is passed into `ModAPI` by `createModAPI` (`packages/game/src/renderer/hosts/createModAPI.ts`) when a mod loads.

## Adding a new domain

Example: adding a `CrewHost`.

### SDK side

**1.** Create `packages/mod-sdk/src/hosts/CrewHost.ts`:

```typescript
export type CrewHost = {
  getMembers(): CrewMember[];
  hire(id: string): void;
  subscribe(listener: (members: CrewMember[]) => void): () => void;
};
```

**2.** Create `packages/mod-sdk/src/api/CrewAPI.ts` following the `GameClockAPI` pattern exactly.

**3.** Add to `ModAPI` in `packages/mod-sdk/src/ModAPI.ts`:

```typescript
import { CrewAPI } from './api/CrewAPI';
import { GameClockAPI } from './api/GameClockAPI';
import type { CrewHost } from './hosts/CrewHost';

export class ModAPI {
  readonly gameClock: GameClockAPI;
  readonly crew: CrewAPI;

  constructor(opts?: { gameClockHost?: GameClockHost; crewHost?: CrewHost }) {
    this.gameClock = new GameClockAPI(opts?.gameClockHost);
    this.crew = new CrewAPI(opts?.crewHost);
  }
}
```

**4.** Export from `packages/mod-sdk/src/index.ts`:

```typescript
export type { CrewHost } from './hosts/CrewHost';
export { CrewAPI } from './api/CrewAPI';
```

### Game side

**5.** Create `packages/game/src/renderer/hosts/crewHost.ts`:

```typescript
import type { CrewHost } from '@asteroid-miner/mod-sdk';

import { useCrewStore } from '../stores/useCrewStore';

export const createCrewHost = (): CrewHost => ({
  getMembers: () => useCrewStore.getState().members,
  hire: (id) => useCrewStore.getState().hire(id),
  subscribe: (listener) =>
    useCrewStore.subscribe((state) => listener(state.members)),
});

export const crewHost = createCrewHost();
```

**6.** Wire into `createModAPI`:

```typescript
import { crewHost } from './crewHost';
import { gameClockHost } from './gameClockHost';

export const createModAPI = () =>
  new ModAPI({
    gameClockHost,
    crewHost,
  });
```
