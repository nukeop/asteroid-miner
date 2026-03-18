import { type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { Button } from '@asteroid-miner/ui';

import { useGameClockStore } from '../stores/useGameClockStore';

export const AdvanceDayButton: FC = () => {
  const { t } = useTranslation();
  const advanceDay = useGameClockStore((s) => s.advanceDay);

  return (
    <Button
      variant="primary"
      onClick={advanceDay}
      className="h-full w-48 rounded-none text-xs [-webkit-app-region:no-drag]"
    >
      {t('common.advanceDay')}
    </Button>
  );
};
