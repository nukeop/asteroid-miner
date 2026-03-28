# Asteroid Miner - Agent Instructions

## What this project is

A management simulation game: "Football Manager meets Dwarf Fortress in space, but Soviet." You run a small private asteroid mining company in a star system ruled by Stalin (no explanation how). Soviet space communism: brutalist stations, diesel-burning spaceships, five-year plans, quota fulfillment, and dark absurdist comedy. 90s post-Soviet aesthetic meets space industry. The tone is the gap between propaganda and reality.

Core loop: Scout > Acquire rights (bureaucracy, bribes) > Crew a ship > Mine > Fulfill quota / Sell surplus > Reinvest.

Desktop app targeting Steam (Mac, Linux). Built on Electron.

**Status:** Early development, "dancing skeleton" stage. The architecture works end-to-end (Electron boots, React renders, IPC handles save/load, Storybook renders components), but no game systems exist yet.

## Monorepo structure

pnpm workspaces for TypeScript packages.

### TypeScript packages (`packages/`)

| Package                    | Purpose                                                                          |
| -------------------------- | -------------------------------------------------------------------------------- |
| `packages/game`            | Main Electron app. electron-vite for unified main/preload/renderer builds.       |
| `packages/model`           | Core game types and models. Shared across game and mod-sdk.                      |
| `packages/ui`              | Shared React component library. Vite library mode, ES module output.             |
| `packages/storybook`       | Storybook 10. Stories live here, not co-located with components.                 |
| `packages/tailwind-config` | Shared Tailwind v4 CSS-first config. No build step. Entry: `src/global.css`.     |
| `packages/eslint-config`   | Shared ESLint flat config. Re-exported by root `eslint.config.ts`.               |
| `packages/i18n`            | i18next + react-i18next wrapper. All UI strings go through this.                 |
| `packages/mod-sdk`         | Modding SDK. Dependency-inversion host pattern. Pure TS interfaces. Publishable. |

### Dependency flow

```
eslint-config  tailwind-config    i18n
                    |               |
                    v               v
     ui <───── storybook         game
     |                             |
     v                             v
   game                        mod-sdk
     |                             |
     v                             v
   model <──────────────────── model
```

## Tech stack

- **TypeScript 5.9**, target ES2022, `moduleResolution: bundler`, strict mode
- **React 19** with automatic JSX runtime
- **Electron 40** via **electron-vite 5**
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

| Command                       | What it does                         |
| ----------------------------- | ------------------------------------ |
| `pnpm dev`                    | `electron-vite dev` with hot reload  |
| `pnpm build`                  | Turbo build across all packages      |
| `pnpm test`                   | Turbo test across all packages       |
| `pnpm lint` / `pnpm lint:fix` | ESLint across all packages           |
| `pnpm type-check`             | Turbo type-check across all packages |
| `pnpm storybook`              | Storybook on port 6006               |

CI runs on push/PR to `master`: lint > type-check > build > test.

## Data packs

Data packs are node packages. The base game, DLCs, and mods all use the same format. Each pack has a `package.json` with an `asteroidMiner` field declaring its type, game version, and which data files it includes. The IPC handler reads only the declared files.

Types for data packs live in `@asteroid-miner/model`: `DataPackManifest`, `DataPackMeta`, `DataPackFiles`, `DataFileName`.

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

- Test behavior, not implementation details. This means we don't do unit tests or small integration tests with mocks.
- E2E tests from the user's perspective. No unit tests on thin wrappers or pass-through layers.
- Tests can only perform actions the user can perform: click buttons, type text, read what's on screen.
- Setup methods are allowed to touch internals.
- Assert on user-visible text, not on element contents.
- Use snapshots (1-2 per component) to cover CSS/DOM structure. Don't assert on CSS classes.
- Snapshot tests: prefix test title with `(Snapshot)`. Don't prefix non-snapshot tests.
- Consolidate related assertions into fewer tests.
- Test wrappers live next to the view they test: `MyView.test-wrapper.tsx`.
- Mocking is only acceptable for external dependencies, like I/O or network requests.

## i18n

All UI strings go through `@asteroid-miner/i18n`. NEVER hardcode user-facing text.

## Strings

All user-facing strings go through i18n, NO hardcoded UI text.
If a new component in the ui package needs labels and other kinds of localized text, it should accept a `labels` prop with the relevant strings. The prop should have its own type defined. Refer to `packages/ui/src/components/TopBar/TopBar.tsx` for an example.

## Utilities

Prefer `lodash-es` over hand-rolled utility functions. If lodash has a function that does what you need (`sample`, `random`, `mapValues`, `isEmpty`, `groupBy`, etc.), use it instead of writing a custom one-liner.

## Electron architecture

- **Main process** (`packages/game/src/main/`): Creates BrowserWindow, registers IPC handlers.
- **Preload** (`packages/game/src/preload/`): Exposes `electronAPI` with `saveGame`/`loadGame` via `contextBridge`.
- **Renderer** (`packages/game/src/renderer/`): React SPA, initializes i18n.
- IPC channels: `save-game` (writes JSON to userData), `load-game` (reads it back), `load-data-pack` (reads a data pack from disk).

## Renderer structure

- **Routes** (`routes/`): Only route definitions (`createFileRoute` + `component` reference). No component bodies.
- **Views** (`views/`): Actual page/layout components rendered by routes.
- **Hooks** (`hooks/`): Custom hooks for async logic (e.g., `useNewGame`). Keep route components thin.
- **Stores** (`stores/`): Zustand stores and React Query options.
- Define components with `FC`: `export const MyComponent: FC<Props> = ({ ... }) => { ... }`. Not `function MyComponent() { ... }`.

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
