# Data packs

A data pack is a folder of JSON files that defines game content: skills, traits, origins, and careers. The base game ships as a data pack. DLCs and community mods use the same format.

## Folder structure

```
my_mod/
  manifest.json
  skills.json
  traits.json
  origins.json
  careers.json
```

`manifest.json` is the only required file. Definition files are optional; include only the ones your mod needs.

## Manifest

Every data pack has a `manifest.json` at its root.

| Field          | Type     | Required | Description                                                                                               |
| -------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `$schema`      | string   | No       | Path to the JSON schema file. Enables editor autocomplete and validation.                                 |
| `id`           | string   | Yes      | Unique pack identifier. Lowercase letters, numbers, underscores, and dots. Pattern: `^[a-z][a-z0-9_.]*$`. |
| `name`         | string   | Yes      | Display name.                                                                                             |
| `version`      | string   | Yes      | Pack version in semver format (`MAJOR.MINOR.PATCH`).                                                      |
| `type`         | string   | Yes      | One of `"base"`, `"dlc"`, or `"mod"`.                                                                     |
| `description`  | string   | Yes      | Short summary of what this pack contains or changes.                                                      |
| `author`       | string   | Yes      | Who made this.                                                                                            |
| `game_version` | string   | Yes      | Minimum game version required (semver).                                                                   |
| `tags`         | string[] | No       | Categorization tags. Defaults to `[]`.                                                                    |
| `dependencies` | string[] | No       | Dependency and conflict declarations. Defaults to `[]`. See [Dependencies](#dependencies).                |

```json
{
  "$schema": "../schema/manifest.schema.json",
  "id": "better_drills",
  "name": "Better Drills",
  "version": "1.0.0",
  "type": "mod",
  "description": "Rebalances drill-related skills and adds new drill operator traits.",
  "author": "SpaceMiner42",
  "game_version": "0.1.0",
  "tags": ["balance", "gameplay"],
  "dependencies": ["base >= 0.1.0"]
}
```

## Dependencies

Each entry in the `dependencies` array is a string:

```
[prefix] pack_id [operator version]
```

Three kinds:

- No prefix: required. The pack won't load without this dependency.
- `?` prefix: optional. Affects load order if the other pack is present, ignored if missing.
- `!` prefix: incompatible. Both packs cannot be loaded together.

Version operators: `>=`, `<=`, `>`, `<`, `=`. Version is semver.

```json
"dependencies": [
  "base >= 0.1.0",
  "? deep_core",
  "? some_expansion >= 2.0.0",
  "! other_drill_overhaul"
]
```

## Skills

`skills.json` is a top-level JSON array of skill objects.

| Field         | Type    | Required | Description                                        |
| ------------- | ------- | -------- | -------------------------------------------------- |
| `id`          | string  | Yes      | Unique skill ID. Pattern: `^[a-z][a-z0-9_]*$`.     |
| `name`        | string  | Yes      | Display name.                                      |
| `description` | string  | Yes      | What this skill represents.                        |
| `xp_base`     | integer | Yes      | XP required to reach level 1. Minimum 1.           |
| `xp_growth`   | number  | Yes      | Per-level XP multiplier. Must be greater than 1.0. |

XP to reach level N = `xp_base * xp_growth ^ (N - 1)`. With `xp_base: 100` and `xp_growth: 1.5`, level 1 costs 100 XP, level 2 costs 150, level 3 costs 225.

```json
[
  {
    "id": "demolition",
    "name": "Demolition",
    "description": "Controlled explosives, shaped charges, and blast pattern calculation.",
    "xp_base": 100,
    "xp_growth": 1.5
  }
]
```

## Traits

`traits.json` is a top-level JSON array of trait objects. Traits modify a pawn's skills or trigger custom effects.

| Field             | Type            | Required | Description                                                     |
| ----------------- | --------------- | -------- | --------------------------------------------------------------- |
| `id`              | string          | Yes      | Unique trait ID. Pattern: `^[a-z][a-z0-9_]*$`.                  |
| `name`            | string          | Yes      | Display name.                                                   |
| `description`     | string          | Yes      | What this trait does.                                           |
| `skill_modifiers` | SkillModifier[] | No       | Adjustments to effective skill levels. Defaults to `[]`.        |
| `custom_effects`  | CustomEffect[]  | No       | Scripted effects outside the modifier system. Defaults to `[]`. |

### Skill modifiers

Each modifier targets a skill with an operation and a value.

| Field   | Type   | Required | Description                                                                       |
| ------- | ------ | -------- | --------------------------------------------------------------------------------- |
| `skill` | string | Yes      | The skill ID to modify.                                                           |
| `op`    | string | Yes      | `"Flat"` (add/subtract a fixed amount) or `"Factor"` (multiply, e.g. 1.2 = +20%). |
| `value` | number | Yes      | The amount to apply.                                                              |

### Custom effects

A named handler with free-form parameters.

| Field     | Type   | Required | Description                                           |
| --------- | ------ | -------- | ----------------------------------------------------- |
| `handler` | string | Yes      | Handler function name.                                |
| `params`  | object | Yes      | Arbitrary key-value parameters passed to the handler. |

```json
[
  {
    "id": "demolitions_expert",
    "name": "Demolitions Expert",
    "description": "Years of field experience with shaped charges and blast calculations.",
    "skill_modifiers": [{ "skill": "demolition", "op": "Flat", "value": 2 }],
    "custom_effects": [
      {
        "handler": "reduce_accident_chance",
        "params": { "skill": "demolition", "factor": 0.5 }
      }
    ]
  }
]
```

## Origins and careers

`origins.json` and `careers.json` share the same structure. Origins represent where a pawn grew up. Careers represent what they did for a living. Both grant starting skill bonuses.

| Field           | Type         | Required | Description                                     |
| --------------- | ------------ | -------- | ----------------------------------------------- |
| `id`            | string       | Yes      | Unique ID. Pattern: `^[a-z][a-z0-9_]*$`.        |
| `name`          | string       | Yes      | Display name.                                   |
| `description`   | string       | Yes      | Backstory text.                                 |
| `skill_bonuses` | SkillBonus[] | No       | Starting skill level bonuses. Defaults to `[]`. |

Each `skill_bonuses` entry:

| Field    | Type    | Required | Description                                      |
| -------- | ------- | -------- | ------------------------------------------------ |
| `id`     | string  | Yes      | Skill ID to apply the bonus to.                  |
| `amount` | integer | Yes      | Levels to add (positive) or subtract (negative). |

Origin example:

```json
[
  {
    "id": "mining_colony",
    "name": "Mining Colony",
    "description": "Grew up on a dusty rock where everyone pulled double shifts at the drill face.",
    "skill_bonuses": [
      { "id": "mining", "amount": 2 },
      { "id": "geology", "amount": 1 }
    ]
  }
]
```

Career example:

```json
[
  {
    "id": "demolitions_tech",
    "name": "Demolitions Technician",
    "description": "Spent five years cracking open played-out shafts for a salvage outfit.",
    "skill_bonuses": [
      { "id": "demolition", "amount": 3 },
      { "id": "mining", "amount": 1 }
    ]
  }
]
```
