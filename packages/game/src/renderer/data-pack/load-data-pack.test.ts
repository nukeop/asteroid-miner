import { describe, expect, it } from 'vitest';

import { loadDataPack } from './load-data-pack';
import { testFiles } from './test-fixtures';

describe('loadDataPack', () => {
  it('(Snapshot) parses definitions from JSON files', () => {
    const defs = loadDataPack(testFiles());

    expect(defs).toMatchSnapshot();
  });
});
