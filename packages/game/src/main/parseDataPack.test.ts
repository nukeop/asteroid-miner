import { beforeEach, describe, expect, it, vi } from 'vitest';

const readFileMock = vi.fn();

vi.mock('node:fs/promises', () => ({
  default: { readFile: readFileMock },
  readFile: readFileMock,
}));

const { parseDataPack } = await import('./parseDataPack');

describe('parseDataPack', () => {
  beforeEach(() => {
    readFileMock.mockReset();
  });

  it('parses a valid manifest', async () => {
    const manifest = {
      name: 'base',
      dataPack: {
        files: ['defs/skills.json', 'defs/traits.json'],
        gameVersion: '0.1.0',
        nameKey: 'pack.base.name',
        descriptionKey: 'pack.base.description',
      },
    };
    readFileMock.mockResolvedValueOnce(JSON.stringify(manifest));

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
    readFileMock.mockResolvedValueOnce(JSON.stringify({ name: 'base' }));

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.contents).toEqual({
      ok: false,
      error:
        '✖ Invalid input: expected object, received undefined\n  → at dataPack',
    });
  });

  it('rejects a manifest whose gameVersion is not semver', async () => {
    const manifest = {
      name: 'base',
      dataPack: {
        files: [],
        gameVersion: 'not-a-version',
        nameKey: 'pack.base.name',
        descriptionKey: 'pack.base.description',
      },
    };
    readFileMock.mockResolvedValueOnce(JSON.stringify(manifest));

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.contents).toEqual({
      ok: false,
      error: '✖ must be semver\n  → at dataPack.gameVersion',
    });
  });

  it('rejects a manifest whose files field is not a string array', async () => {
    const manifest = {
      name: 'base',
      dataPack: {
        files: 'defs/skills.json',
        gameVersion: '0.1.0',
        nameKey: 'pack.base.name',
        descriptionKey: 'pack.base.description',
      },
    };
    readFileMock.mockResolvedValueOnce(JSON.stringify(manifest));

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.contents).toEqual({
      ok: false,
      error:
        '✖ Invalid input: expected array, received string\n  → at dataPack.files',
    });
  });

  it('returns a parse error for malformed JSON', async () => {
    readFileMock.mockResolvedValueOnce('this is not json');

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
    readFileMock.mockRejectedValueOnce(missingError);

    const pack = await parseDataPack('/fake/pack');

    expect(pack.manifest.file.text).toEqual({ ok: false, error: missingError });
    expect(pack.manifest.contents).toEqual({
      ok: false,
      error: 'Could not load file',
    });
  });
});
