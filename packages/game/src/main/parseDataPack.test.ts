import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs/promises', () => ({
  default: { readFile: vi.fn() },
  readFile: vi.fn(),
}));

const { FsMock } = await import('../test/fs-mock');
const { parseDataPack } = await import('./parseDataPack');

const validManifest = {
  name: 'base',
  dataPack: {
    files: ['defs/skills.json', 'defs/traits.json'],
    gameVersion: '0.1.0',
    nameKey: 'pack.base.name',
    descriptionKey: 'pack.base.description',
  },
};

describe('parseDataPack', () => {
  beforeEach(() => {
    FsMock.reset();
  });

  it('parses a valid manifest', async () => {
    FsMock.setFiles({
      '/fake/pack/package.json': JSON.stringify(validManifest),
      '/fake/pack/defs/skills.json': '[]',
      '/fake/pack/defs/traits.json': '[]',
    });

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.contents).toMatchObject({
      ok: true,
      value: {
        dataPack: {
          files: ['defs/skills.json', 'defs/traits.json'],
          gameVersion: '0.1.0',
          nameKey: 'pack.base.name',
          descriptionKey: 'pack.base.description',
        },
      },
    });
  });

  it('rejects a manifest missing the dataPack field', async () => {
    FsMock.setFiles({
      '/fake/pack/package.json': JSON.stringify({ name: 'base' }),
    });

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.contents).toEqual({
      ok: false,
      error:
        '✖ Invalid input: expected object, received undefined\n  → at dataPack',
    });
  });

  it('rejects a manifest whose gameVersion is not semver', async () => {
    FsMock.setFiles({
      '/fake/pack/package.json': JSON.stringify({
        name: 'base',
        dataPack: {
          files: [],
          gameVersion: 'not-a-version',
          nameKey: 'pack.base.name',
          descriptionKey: 'pack.base.description',
        },
      }),
    });

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.contents).toEqual({
      ok: false,
      error: '✖ must be semver\n  → at dataPack.gameVersion',
    });
  });

  it('rejects a manifest whose files field is not a string array', async () => {
    FsMock.setFiles({
      '/fake/pack/package.json': JSON.stringify({
        name: 'base',
        dataPack: {
          files: 'defs/skills.json',
          gameVersion: '0.1.0',
          nameKey: 'pack.base.name',
          descriptionKey: 'pack.base.description',
        },
      }),
    });

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.contents).toEqual({
      ok: false,
      error:
        '✖ Invalid input: expected array, received string\n  → at dataPack.files',
    });
  });

  it('returns a parse error for malformed JSON', async () => {
    FsMock.setFiles({
      '/fake/pack/package.json': 'this is not json',
    });

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.contents).toEqual({
      ok: false,
      error: 'Invalid JSON',
    });
  });

  it('returns a file error when the manifest is missing', async () => {
    const missingError = Object.assign(new Error('ENOENT: no such file'), {
      code: 'ENOENT',
    });
    FsMock.setFileError('/fake/pack/package.json', missingError);

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.file.text).toEqual({ ok: false, error: missingError });
    expect(pack.manifest.contents).toEqual({
      ok: false,
      error: 'Could not load file',
    });
  });

  it('does not attempt to load any files when the manifest cannot be loaded', async () => {
    FsMock.setFileError('/fake/pack/package.json', new Error('ENOENT'));

    const pack = await parseDataPack('/fake/pack');

    expect(pack.files).toEqual([]);
  });

  it('does not attempt to load any files when the manifest fails schema validation', async () => {
    FsMock.setFiles({
      '/fake/pack/package.json': JSON.stringify({ name: 'base' }),
    });

    const pack = await parseDataPack('/fake/pack');

    expect(pack.files).toEqual([]);
  });

  it('parses defs from each file listed in the manifest', async () => {
    const skill = {
      type: 'skill',
      id: 'base:mining',
      nameKey: 'skill.mining.name',
      descriptionKey: 'skill.mining.description',
      xpBase: 100,
      xpGrowth: 1.5,
    };
    const otherSkill = {
      type: 'skill',
      id: 'base:piloting',
      nameKey: 'skill.piloting.name',
      descriptionKey: 'skill.piloting.description',
      xpBase: 100,
      xpGrowth: 1.5,
    };
    const tag = {
      type: 'tag',
      id: 'base:fuel',
      nameKey: 'tag.fuel.name',
    };
    FsMock.setFiles({
      '/fake/pack/package.json': JSON.stringify(validManifest),
      '/fake/pack/defs/skills.json': JSON.stringify([skill, otherSkill]),
      '/fake/pack/defs/traits.json': JSON.stringify([tag]),
    });

    const pack = await parseDataPack('/fake/pack');

    expect(pack.files).toEqual([
      {
        file: {
          path: '/fake/pack/defs/skills.json',
          text: { ok: true, value: JSON.stringify([skill, otherSkill]) },
        },
        contents: { ok: true, value: [skill, otherSkill] },
      },
      {
        file: {
          path: '/fake/pack/defs/traits.json',
          text: { ok: true, value: JSON.stringify([tag]) },
        },
        contents: { ok: true, value: [tag] },
      },
    ]);
  });
});
