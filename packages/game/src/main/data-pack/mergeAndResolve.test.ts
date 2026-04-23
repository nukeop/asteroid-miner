import { describe, expect, it } from 'vitest';

import { DataPackBuilder } from '../../test/builders/DataPackBuilder';
import { SkillDefBuilder } from '../../test/builders/SkillDefBuilder';
import { mergeAndResolve } from './mergeAndResolve';

describe('mergeAndResolve', () => {
  it('merges defs from multiple packs into one bucket keyed by id', () => {
    const miningSkill = new SkillDefBuilder().withId('base:mining').build();
    const pilotingSkill = new SkillDefBuilder().withId('dlc:piloting').build();

    const result = mergeAndResolve([
      new DataPackBuilder().withName('base').withDefs([miningSkill]).build(),
      new DataPackBuilder().withName('dlc').withDefs([pilotingSkill]).build(),
    ]);

    expect(result.definitions.skills).toEqual({
      'base:mining': miningSkill,
      'dlc:piloting': pilotingSkill,
    });
  });

  it('emits a warning when a later pack overrides an id from an earlier pack', () => {
    const miningSkill = new SkillDefBuilder().withId('base:mining').build();
    const miningSkillOverride = new SkillDefBuilder()
      .withId('base:mining')
      .withNameKey('skill.mining.override.name')
      .build();

    const result = mergeAndResolve([
      new DataPackBuilder().withName('base').withDefs([miningSkill]).build(),
      new DataPackBuilder()
        .withName('dlc')
        .withDefs([miningSkillOverride])
        .build(),
    ]);

    expect(result.definitions.skills['base:mining']).toEqual(
      miningSkillOverride,
    );
    expect(result.warnings).toEqual([
      "Pack 'dlc' overrides 'base:mining' from pack 'base'",
    ]);
  });
});
