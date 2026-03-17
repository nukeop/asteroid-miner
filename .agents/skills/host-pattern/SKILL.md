---
name: host-pattern
description: Use when adding a new domain to the mod SDK, or implementing a host. Covers the host type, API class, and host implementation structure, and what files to create and modify. Trigger phrases include "add a domain", "new host", "host implementation", "host pattern", "createModAPI".
---

# Host pattern

Every game system the mod SDK supports follows the same three-layer structure:

1. **Host type** - the contract (mod-sdk, no implementation)
2. **API class** - what mods actually call (mod-sdk, wraps the host)
3. **Host implementation** - bridges the API to game internals (game package)

Mods call methods on an API class (e.g. `api.gameClock.getTurn()`). They never touch a host directly.

## Files to create/modify

### mod-sdk (`packages/mod-sdk/`)

| Action | File                          | What                                             |
| ------ | ----------------------------- | ------------------------------------------------ |
| Create | `src/hosts/YourDomainHost.ts` | `YourDomainHost` type + related types            |
| Create | `src/api/YourDomainAPI.ts`    | `YourDomainAPI` class                            |
| Modify | `src/ModAPI.ts`               | Add `yourDomainHost` option + `yourDomain` field |
| Modify | `src/index.ts`                | Export host type and API class                   |

### game (`packages/game/src/renderer/hosts/`)

| Action | File                | What                                   |
| ------ | ------------------- | -------------------------------------- |
| Create | `yourDomainHost.ts` | Host implementation + singleton export |
| Modify | `createModAPI.ts`   | Pass singleton to `ModAPI` constructor |
| Modify | `index.ts`          | Barrel export                          |

## API class pattern

Every API class follows this exact structure:

```typescript
// packages/mod-sdk/src/api/YourDomainAPI.ts
import type { YourDomainHost } from '../hosts/YourDomainHost';

export class YourDomainAPI {
  #host?: YourDomainHost;

  constructor(host?: YourDomainHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: YourDomainHost) => T): T {
    if (!this.#host) {
      throw new Error('YourDomain host not available');
    }
    return fn(this.#host);
  }

  yourMethod(arg: SomeType) {
    return this.#withHost((h) => h.yourMethod(arg));
  }
}
```

Reference: `packages/mod-sdk/src/api/GameClockAPI.ts`

## Connecting to ModAPI

```typescript
// packages/mod-sdk/src/ModAPI.ts
import { YourDomainAPI } from './api/YourDomainAPI';
import type { YourDomainHost } from './hosts/YourDomainHost';

export class ModAPI {
  // Add field:
  readonly yourDomain: YourDomainAPI;

  constructor(opts?: {
    // Add option:
    yourDomainHost?: YourDomainHost;
    // ... existing options
  }) {
    // Add to constructor body:
    this.yourDomain = new YourDomainAPI(opts?.yourDomainHost);
  }
}
```

```typescript
// packages/game/src/renderer/hosts/createModAPI.ts
import { yourDomainHost } from './yourDomainHost';

export const createModAPI = () =>
  new ModAPI({
    yourDomainHost,
    // ... existing hosts
  });
```

## Host implementation pattern

```typescript
// packages/game/src/renderer/hosts/yourDomainHost.ts
import type { YourDomainHost } from '@asteroid-miner/mod-sdk';

import { useYourDomainStore } from '../stores/useYourDomainStore';

export const createYourDomainHost = (): YourDomainHost => ({
  getValue: () => useYourDomainStore.getState().value,
  doThing: (arg) => useYourDomainStore.getState().doThing(arg),
  subscribe: (listener) =>
    useYourDomainStore.subscribe((state) => listener(state.value)),
});

export const yourDomainHost = createYourDomainHost();
```

Reference: `packages/game/src/renderer/hosts/gameClockHost.ts`

## Conventions

- Host types are plain `type`, not `interface` or classes.
- Host methods are synchronous unless a specific method genuinely needs `Promise`.
- Each host file exports both a factory (`createFooHost`) and a singleton (`fooHost`). `createModAPI` uses the singletons.
- The store is the source of truth. Hosts are thin adapters — no logic beyond delegation.
- All hosts are optional in the `ModAPI` constructor. TypeScript will catch missing fields if you add a host to `ModAPI` but forget to pass it in `createModAPI`.
