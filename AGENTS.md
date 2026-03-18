# Asteroid Miner - Agent Instructions

## What this project is

A management simulation game: "Football Manager meets Dwarf Fortress in space, but Soviet." You run a small private asteroid mining company in a star system ruled by Stalin (no explanation how). Soviet space communism: brutalist stations, diesel-burning spaceships, five-year plans, quota fulfillment, and dark absurdist comedy. 90s post-Soviet aesthetic meets space industry. The tone is the gap between propaganda and reality.

Core loop: Scout > Acquire rights (bureaucracy, bribes) > Crew a ship > Mine > Fulfill quota / Sell surplus > Reinvest.

Desktop app targeting Steam (Mac, Linux). Built on Electron.

**Status:** Early development, "dancing skeleton" stage. The architecture works end-to-end (Electron boots, React renders, Rust compiles to WASM, IPC handles save/load, Storybook renders components), but no game systems exist yet.

## Monorepo structure

pnpm workspaces for TypeScript packages, Cargo workspace for Rust crates.

### TypeScript packages (`packages/`)

| Package                    | Purpose                                                                          |
| -------------------------- | -------------------------------------------------------------------------------- |
| `packages/game`            | Main Electron app. electron-vite for unified main/preload/renderer builds.       |
| `packages/ui`              | Shared React component library. Vite library mode, ES module output.             |
| `packages/storybook`       | Storybook 10. Stories live here, not co-located with components.                 |
| `packages/tailwind-config` | Shared Tailwind v4 CSS-first config. No build step. Entry: `src/global.css`.     |
| `packages/eslint-config`   | Shared ESLint flat config. Re-exported by root `eslint.config.ts`.               |
| `packages/i18n`            | i18next + react-i18next wrapper. All UI strings go through this.                 |
| `packages/mod-sdk`         | Modding SDK. Dependency-inversion host pattern. Pure TS interfaces. Publishable. |

### Rust crates (`crates/`)

| Crate                  | Purpose                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| `asteroid-miner-types` | Shared ID newtypes, enums, primitives used across all Rust crates.               |
| `asteroid-miner-defs`  | Definition structs (\*Def), Registry, Definitions, data pack loading/validation. |
| `asteroid-miner-world` | Runtime game state: GameState, Pawn, and future instance types.                  |
| `asteroid-miner-wasm`  | WASM boundary glue. This is the crate that wasm-pack builds.                     |

### Dependency flow

```
eslint-config  tailwind-config    i18n
                    |               |
                    v               v
     ui <───── storybook         game
     |                             |
     v                             v
   game <──── wasm (WASM)      mod-sdk

types → defs → world → wasm
```

The game package imports the WASM module via a Vite alias (`@wasm` -> `crates/asteroid-miner-wasm/pkg`).

## Tech stack

- **TypeScript 5.9**, target ES2022, `moduleResolution: bundler`, strict mode
- **React 19** with automatic JSX runtime
- **Electron 40** via **electron-vite 5**
- **Rust** (edition 2024) for the simulation engine, compiled to WASM via `wasm-pack --target web`
- **Vite 7** for all builds. Library packages use Vite library mode + `vite-plugin-dts`
- **Tailwind CSS v4**, CSS-first config (no JS config file). Colors in OKLCH.
- **cva** (class-variance-authority) for component variants
- **TanStack Table** + **TanStack Virtual** for data tables
- **lucide-react** for icons
- **Vitest 4** + **@testing-library/react** + jsdom for tests
- **ESLint 10** flat config + **Prettier** with import sorting and Tailwind class sorting
- **Husky** pre-commit hook runs lint-staged (`eslint --fix` on staged files)

## State management

- **TanStack React Query** for all async state (loading, error, caching). Never track loading/error manually with `useState`.
- **Zustand** for synchronous global state that needs to be accessed outside React (e.g., game loop reading definitions). Keep stores thin.
- Extract async logic into custom hooks (e.g., `useNewGame`), not inline in route components.

## Development workflow

| Command                       | What it does                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`                    | `electron-vite dev` with hot reload                                           |
| `pnpm build`                  | Turbo build across all packages                                               |
| `pnpm build:wasm`             | `wasm-pack build` the simulation crate. **Must run before `dev` or `build`.** |
| `pnpm test`                   | Turbo test across all packages                                                |
| `pnpm test:rust`              | `cargo test` across all Rust crates                                           |
| `pnpm lint` / `pnpm lint:fix` | ESLint across all packages                                                    |
| `pnpm type-check`             | Turbo type-check across all packages                                          |
| `pnpm storybook`              | Storybook on port 6006                                                        |

CI runs on push/PR to `master`: lint > type-check > build > test > cargo test.

## UI components

- Follow the `creating-components` skill in `.agents/skills/creating-components/SKILL.md`.
- Components use `cva` + `FC` + `ComponentProps`.
- All components live in `packages/ui/src/components/ComponentName/`.
- Each component directory has: `ComponentName.tsx`, `ComponentName.test.tsx`, `index.ts` (barrel re-export).
- Export chain: component `index.ts` > `components/index.ts` > `src/index.ts`.
- Use `cn()` from `../../utils` for class merging (`clsx` + `tailwind-merge`).
- Use `cn` object syntax for conditional classes: `cn('base', { 'active-class': isActive })`. No ternaries or `&&` for applying classes.
- Generic components (like DataTable) use `function` declarations instead of `FC` to support type parameters.
- Named exports only, no default exports.

## CRT styling

- Two palettes: amber (primary) and green (secondary), defined in OKLCH in `packages/tailwind-config/src/global.css`.
- CRT effects (scanlines, flicker, vignette, glow) live in `packages/tailwind-config/src/crt.css` as `@utility` classes.
- Effects are composed in the `CrtScreen` component.
- Body base: `bg-amber-deep text-amber-text font-sans`.
- Everything is monospace: `--font-sans` and `--font-mono` both point to Share Tech Mono.

## Storybook

- Stories live in `packages/storybook/src/`, NOT co-located with components.
- Use `const meta: Meta<typeof X> = {}`, not `satisfies Meta<>` (type inference issues with pnpm hoisting).
- Wrap table stories in `<CrtScreen>` to see them in context.
- Use real-looking game data in stories.

## Fonts

- Share Tech Mono: regular UI (both `--font-sans` and `--font-mono`).
- Geo: h3/h4 headings (`--font-display`).
- Orbitron Variable: h1/h2 headings (`--font-heading`).
- Loaded via `@fontsource` packages.

## Testing conventions

- Test behavior, not implementation details.
- E2E tests from the user's perspective. No unit tests on thin wrappers or pass-through layers.
- Tests can only perform actions the user can perform: click buttons, type text, read what's on screen.
- Setup methods are allowed to touch internals.
- Assert on user-visible text, not on element contents.
- Use snapshots (1-2 per component) to cover CSS/DOM structure. Don't assert on CSS classes.
- Snapshot tests: prefix test title with `(Snapshot)`. Don't prefix non-snapshot tests.
- Consolidate related assertions into fewer tests.
- Test wrappers live next to the view they test: `MyView.test-wrapper.tsx`.

## i18n

All UI strings go through `@asteroid-miner/i18n`. NEVER hardcode user-facing text.

## Strings

All user-facing strings go through i18n, NO hardcoded UI text.
If a new component in the ui package needs labels and other kinds of localized text, it should accept a `labels` prop with the relevant strings. The prop should have its own type defined. Refer to `packages/ui/src/components/TopBar/TopBar.tsx` for an example.

## Electron architecture

- **Main process** (`packages/game/src/main/`): Creates BrowserWindow, registers IPC handlers.
- **Preload** (`packages/game/src/preload/`): Exposes `electronAPI` with `saveGame`/`loadGame` via `contextBridge`.
- **Renderer** (`packages/game/src/renderer/`): React SPA. Imports WASM module, initializes i18n.
- IPC channels: `save-game` (writes JSON to userData), `load-game` (reads it back).

## Renderer structure

- **Routes** (`routes/`): Only route definitions (`createFileRoute` + `component` reference). No component bodies.
- **Views** (`views/`): Actual page/layout components rendered by routes.
- **Hooks** (`hooks/`): Custom hooks for async logic (e.g., `useNewGame`). Keep route components thin.
- **Stores** (`stores/`): Zustand stores and React Query options.
- Define components with `FC`: `export const MyComponent: FC<Props> = ({ ... }) => { ... }`. Not `function MyComponent() { ... }`.

## Simulation (Rust/WASM)

- Cargo workspace at the repo root with four crates in `crates/`.
- `asteroid-miner-types`: shared ID newtypes and enums.
- `asteroid-miner-defs`: definition structs, Registry, Definitions, data pack loading.
- `asteroid-miner-world`: runtime game state (GameState, Pawn).
- `asteroid-miner-wasm`: WASM boundary glue, compiled via `wasm-pack --target web`.
- WASM output goes to `crates/asteroid-miner-wasm/pkg/`, imported by the game renderer via `@wasm` Vite alias.
- Uses `wasm-bindgen`, `serde`, `serde-wasm-bindgen` for JS interop.

## Mod SDK

Follows a dependency-inversion pattern: SDK defines host interfaces (contracts between game and mods), game provides implementations, mods receive a `ModAPI` object composed of typed host objects. Currently one placeholder host: `GameStateHost`.

## Package exports pattern

Source files are the entry points for workspace consumption (Vite resolves them directly). Built types live in `dist/`:

```json
{
  "main": "./src/index.ts",
  "module": "./src/index.ts",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./dist/index.d.ts"
    }
  }
}
```
