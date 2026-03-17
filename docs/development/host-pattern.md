# Host pattern

How game systems expose functionality to mods.

## Modding SDK layers

Hosts are the main way the game exposes functionality to mods. Each host represents a game system and provides methods to read and mutate that system's state.

**mod-sdk** defines host types and the `ModAPI` interface.

**game** implements each host as a factory function that delegates to Zustand stores. `createModAPI()` assembles all hosts into a `ModAPI` object. A mod receives this object in its `onLoad`/`onUnload` hooks.

## Example host: GameClock

| File                                                | Purpose                                           |
| --------------------------------------------------- | ------------------------------------------------- |
| `packages/mod-sdk/src/hosts/GameClockHost.ts`       | Type definition                                   |
| `packages/mod-sdk/src/ModAPI.ts`                    | `gameClock: GameClockHost`                        |
| `packages/game/src/renderer/hosts/gameClockHost.ts` | Implementation (delegates to `useGameClockStore`) |
| `packages/game/src/renderer/hosts/createModAPI.ts`  | Assembles all hosts into a `ModAPI`               |

The host is a plain object. Each method calls `useGameClockStore.getState()` to read or mutate the store. `subscribe` wraps Zustand's `.subscribe()`.

## Adding a new host

Example: adding a `CrewHost`.

### 1. Define the type in mod-sdk

Create `packages/mod-sdk/src/hosts/CrewHost.ts`:

```ts
export type CrewHost = {
  getCrewMembers(): CrewMember[];
  hireCrewMember(id: string): void;
  subscribe(listener: (crew: CrewMember[]) => void): () => void;
};
```

### 2. Add it to ModAPI

In `packages/mod-sdk/src/ModAPI.ts`:

```ts
import type { CrewHost } from './hosts/CrewHost';
import type { GameClockHost } from './hosts/GameClockHost';

export interface ModAPI {
  GameClock: GameClockHost;
  Crew: CrewHost;
}
```

### 3. Export it from the barrel

In `packages/mod-sdk/src/index.ts`:

```ts
export type { CrewHost } from './hosts/CrewHost';
```

### 4. Implement the host in the game package

Create `packages/game/src/renderer/hosts/crewHost.ts`:

```ts
import type { CrewHost } from '@asteroid-miner/mod-sdk';

import { useCrewStore } from '../stores/useCrewStore';

export const createCrewHost = (): CrewHost => ({
  getCrewMembers: () => useCrewStore.getState().members,
  hireCrewMember: (id) => useCrewStore.getState().hire(id),
  subscribe: (listener) =>
    useCrewStore.subscribe((state) => listener(state.members)),
});
```

### 5. Connect it to createModAPI

In `packages/game/src/renderer/hosts/createModAPI.ts`:

```ts
import { createCrewHost } from './crewHost';
import { createGameClockHost } from './gameClockHost';

export const createModAPI = (): ModAPI => ({
  GameClock: createGameClockHost(),
  Crew: createCrewHost(),
});
```

TypeScript enforces completeness: if `ModAPI` lists a host and `createModAPI` doesn't provide it, the build fails.

## How mods receive the API

A mod implements the `Mod` interface from the SDK:

```ts
const myMod: Mod = {
  manifest: {
    name: 'my-mod',
    version: '1.0.0',
    description: '...',
    author: '...',
  },
  onLoad(api) {
    const turn = api.gameClock.getTurn();
    api.gameClock.subscribe((turn) => {
      /* react to day changes */
    });
  },
  onUnload(api) {
    /* cleanup */
  },
};
```

The game calls `createModAPI()` once per mod and passes the result to `onLoad`. The mod loader that does this doesn't exist yet.