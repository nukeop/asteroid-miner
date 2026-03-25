import { describe, expect, it } from 'vitest';

import { DataPack } from './DataPack';
import { testFiles } from './test-fixtures';

describe('DataPack', () => {
  it('(Snapshot) parses definitions from JSON files', () => {
    const pack = new DataPack(testFiles());

    expect(pack.definitions).toMatchSnapshot();
  });
});
