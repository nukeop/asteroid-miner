import { describe, expect, it } from 'vitest';

import { DataPackBuilder } from '../../test/builders/DataPackBuilder';
import { SkillDefBuilder } from '../../test/builders/SkillDefBuilder';
import { TagDefBuilder } from '../../test/builders/TagDefBuilder';
import { mergeAndResolve } from './mergeAndResolve';

describe('mergeAndResolve', () => {
  it('merges defs from multiple packs into one bucket keyed by id', () => {
    const miningSkill = new SkillDefBuilder().withId('base:mining').build();
    const pilotingSkill = new SkillDefBuilder().withId('dlc:piloting').build();

    const result = mergeAndResolve([
      new DataPackBuilder()
        .withName('base')
        .withDefs('defs/skills.json', [miningSkill])
        .build(),
      new DataPackBuilder()
        .withName('dlc')
        .withDefs('defs/skills.json', [pilotingSkill])
        .build(),
    ]);

    expect(result.value.skills).toEqual({
      'base:mining': miningSkill,
      'dlc:piloting': pilotingSkill,
    });
  });

  it('collapses duplicate ids within a single pack to the last one with a warning', () => {
    const firstMining = new SkillDefBuilder().withId('base:mining').build();
    const secondMining = new SkillDefBuilder()
      .withId('base:mining')
      .withNameKey('skill.mining.second.name')
      .build();

    const result = mergeAndResolve([
      new DataPackBuilder()
        .withName('base')
        .withDefs('defs/skills.json', [firstMining, secondMining])
        .build(),
    ]);

    expect(result.value.skills).toEqual({ 'base:mining': secondMining });
    expect(result.warnings).toEqual([
      "Pack 'base' contains duplicate id 'base:mining'",
    ]);
  });

  it('routes each def to the bucket matching its type discriminator', () => {
    const skill = new SkillDefBuilder().withId('base:mining').build();
    const tag = new TagDefBuilder().withId('base:fuel').build();

    const result = mergeAndResolve([
      new DataPackBuilder()
        .withName('base')
        .withDefs('defs/all.json', [skill, tag])
        .build(),
    ]);

    expect(result.value.skills).toEqual({ 'base:mining': skill });
    expect(result.value.tags).toEqual({ 'base:fuel': tag });
  });

  it('loads defs from every file the pack ships', () => {
    const skill = new SkillDefBuilder().withId('base:mining').build();
    const tag = new TagDefBuilder().withId('base:fuel').build();

    const result = mergeAndResolve([
      new DataPackBuilder()
        .withName('base')
        .withDefs('defs/skills.json', [skill])
        .withDefs('defs/tags.json', [tag])
        .build(),
    ]);

    expect(result.value.skills).toEqual({ 'base:mining': skill });
    expect(result.value.tags).toEqual({ 'base:fuel': tag });
  });

  it('reports an error when a pack has a failed def file', () => {
    const result = mergeAndResolve([
      new DataPackBuilder()
        .withName('base')
        .withFailedDefFile('defs/skills.json', 'Invalid JSON')
        .build(),
    ]);

    expect(result.errors).toEqual([
      "Pack 'base' failed to load '/fake/packs/base/defs/skills.json': Invalid JSON",
    ]);
  });

  it('emits a warning when a later pack overrides an id from an earlier pack', () => {
    const miningSkill = new SkillDefBuilder().withId('base:mining').build();
    const miningSkillOverride = new SkillDefBuilder()
      .withId('base:mining')
      .withNameKey('skill.mining.override.name')
      .build();

    const result = mergeAndResolve([
      new DataPackBuilder()
        .withName('base')
        .withDefs('defs/skills.json', [miningSkill])
        .build(),
      new DataPackBuilder()
        .withName('dlc')
        .withDefs('defs/skills.json', [miningSkillOverride])
        .build(),
    ]);

    expect(result.value.skills['base:mining']).toEqual(miningSkillOverride);
    expect(result.warnings).toEqual([
      "Pack 'dlc' overrides 'base:mining' from pack 'base'",
    ]);
  });
});
