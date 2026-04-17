import { RussianRubleIcon } from 'lucide-react';
import { type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';

import { useGameClockStore } from '../stores/useGameClockStore';
import { turnToDate } from '../utils/calendar';
import { AdvanceDayButton } from './AdvanceDayButton';

export const ConnectedTopBar: FC = () => {
  const { t } = useTranslation();
  const turn = useGameClockStore((s) => s.turn);
  const date = turnToDate(turn);

  return (
    <>
      <span className="font-heading text-crt-text w-48 text-xs tracking-widest uppercase">
        Test
      </span>

      <div className="flex flex-1 items-center justify-center gap-3">
        <span className="text-crt-text text-sm tracking-wide">
          {t('common.credits', { amount: '10,000' })}
          <RussianRubleIcon size={12} className="ml-1 inline" />
        </span>
        <span className="text-crt-muted">|</span>
        <span
          data-testid="top-bar-date"
          className="text-crt-text text-sm tracking-wide"
        >
          {t('common.date', {
            dayOrdinal: t('common.dayOrdinal', {
              count: date.day,
              ordinal: true,
            }),
            month: t(`common.months.${date.month}`),
            year: date.year,
          })}
        </span>
      </div>

      <AdvanceDayButton />
    </>
  );
};
