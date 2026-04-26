import type { SkillDef } from '@asteroid-miner/model';

export class SkillDefBuilder {
  private skill: SkillDef = {
    type: 'skill',
    id: 'base:test-skill',
    nameKey: 'skill.test.name',
    descriptionKey: 'skill.test.description',
    xpBase: 100,
    xpGrowth: 1.5,
  };

  withId(id: string): this {
    this.skill.id = id;
    return this;
  }

  withNameKey(nameKey: string): this {
    this.skill.nameKey = nameKey;
    return this;
  }

  withDescriptionKey(descriptionKey: string): this {
    this.skill.descriptionKey = descriptionKey;
    return this;
  }

  withXpBase(xpBase: number): this {
    this.skill.xpBase = xpBase;
    return this;
  }

  withXpGrowth(xpGrowth: number): this {
    this.skill.xpGrowth = xpGrowth;
    return this;
  }

  build(): SkillDef {
    return { ...this.skill };
  }
}
