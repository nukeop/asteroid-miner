# Asteroid Miner - Agent Instructions

## UI components

- Follow the `creating-components` skill in `.agents/skills/creating-components/SKILL.md`.
- Components use `cva` + `FC` + `ComponentProps`.
- All components live in `packages/ui/src/components/ComponentName/`.
- Export from `packages/ui/src/components/index.ts` and `packages/ui/src/index.ts`.
- Use `cn()` from `../../utils` for class merging.

## CRT styling

- Two palettes: amber (primary) and green (secondary), defined in OKLCH in `packages/tailwind-config/src/global.css`.
- CRT effects (scanlines, flicker, vignette, glow) live in `packages/tailwind-config/src/crt.css` as `@utility` classes.

## Storybook

- Stories live in `packages/storybook/src/`.
- Use `const meta: Meta<typeof X> = {}`, not `satisfies Meta<>` (type inference issues with pnpm hoisting).
- Separate stories when they need different container constraints (e.g., virtualized tables need fixed-height containers, non-virtualized ones don't).
- Wrap table stories in `<CrtScreen>` to see them in context.

## Fonts

- Share Tech Mono (regular UI), Geo (h3/h4), Orbitron Variable (h1/h2).
- Loaded via `@fontsource` packages.