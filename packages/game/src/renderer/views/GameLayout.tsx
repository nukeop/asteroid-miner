import { Outlet } from '@tanstack/react-router';
import { type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { GameShell } from '@asteroid-miner/ui';

import { useGameClockStore } from '../stores/useGameClockStore';
import { turnToDate } from '../utils/calendar';

export const GameLayout: FC = () => {
  const { t } = useTranslation();
  const turn = useGameClockStore((s) => s.turn);
  const advanceDay = useGameClockStore((s) => s.advanceDay);
  const date = turnToDate(turn);

  return (
    <GameShell
      companyName="Test"
      onAdvanceDay={advanceDay}
      topBarLabels={{
        day: t('common.date', {
          dayOrdinal: t('common.dayOrdinal', {
            count: date.day,
            ordinal: true,
          }),
          month: t(`common.months.${date.month}`),
          year: date.year,
        }),
        credits: t('common.credits', { amount: '10,000' }),
        advanceDay: t('common.advanceDay'),
      }}
    >
      <Outlet />
    </GameShell>
  );
};
