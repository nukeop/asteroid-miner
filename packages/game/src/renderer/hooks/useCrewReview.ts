import { useCallback, useState } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import type { Pawn } from '@asteroid-miner/model';

import { useGameStateStore } from '../stores/useGameStateStore';

type CrewMember = {
  id: string;
  pawn: Pawn;
  isSelected: boolean;
};

type SkillRow = {
  id: string;
  name: string;
  level: number;
};

export function useCrewReview() {
  const { t } = useTranslation();
  const gameState = useGameStateStore((s) => s.state);
  const rerollCrewMember = useGameStateStore((s) => s.rerollCrewMember);
  const resetGame = useGameStateStore((s) => s.resetGame);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const reroll = useCallback(() => {
    rerollCrewMember(selectedIndex);
  }, [rerollCrewMember, selectedIndex]);

  // gameState is null only during hot reload when the store resets
  // while the component is still mounted
  if (!gameState) {
    return {
      defs: null,
      crewList: [] as CrewMember[],
      selectedPawn: null,
      skills: [] as SkillRow[],
      teamSkills: [] as SkillRow[],
      selectCrewMember: setSelectedIndex,
      reroll,
      resetGame,
    };
  }

  const { crew, crewOrder, defs } = gameState;
  const selectedPawn = crew[crewOrder[selectedIndex]];

  const crewList: CrewMember[] = crewOrder.map((pawnId, index) => ({
    id: pawnId,
    pawn: crew[pawnId],
    isSelected: index === selectedIndex,
  }));

  const skills: SkillRow[] = Object.entries(defs.skills).map(
    ([skillId, skillDef]) => ({
      id: skillId,
      name: t(skillDef.nameKey),
      level: selectedPawn.skills[skillId]?.level ?? 0,
    }),
  );

  const pawns = Object.values(crew);
  const teamSkills: SkillRow[] = Object.entries(defs.skills).map(
    ([skillId, skillDef]) => ({
      id: skillId,
      name: t(skillDef.nameKey),
      level: Math.max(0, ...pawns.map((p) => p.skills[skillId]?.level ?? 0)),
    }),
  );

  return {
    defs,
    crewList,
    selectedPawn,
    skills,
    teamSkills,
    selectCrewMember: setSelectedIndex,
    reroll,
    resetGame,
  };
}
