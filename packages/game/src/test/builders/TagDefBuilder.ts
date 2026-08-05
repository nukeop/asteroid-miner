import type { TagDef } from '@asteroid-miner/model';

export class TagDefBuilder {
  private tag: TagDef = {
    type: 'tag',
    id: 'base:test-tag',
    nameKey: 'tag.test.name',
  };

  withId(id: string): this {
    this.tag.id = id;
    return this;
  }

  withNameKey(nameKey: string): this {
    this.tag.nameKey = nameKey;
    return this;
  }

  build(): TagDef {
    return { ...this.tag };
  }
}
