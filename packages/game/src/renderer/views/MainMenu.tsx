import { useNavigate } from '@tanstack/react-router';
import { type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { Button } from '@asteroid-miner/ui';

import { useNewGame } from '../hooks/useNewGame';

export const MainMenu: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const newGame = useNewGame();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-heading mb-8 text-4xl tracking-widest uppercase">
        {t('title')}
      </h1>
      <Button
        className="w-48"
        loading={newGame.isPending}
        onClick={() => newGame.mutate()}
      >
        {t('common.newGame')}
      </Button>
      <Button
        className="w-48"
        variant="secondary"
        onClick={() => navigate({ to: '/preferences' })}
      >
        {t('common.preferences')}
      </Button>
      <Button className="w-48" variant="ghost" onClick={() => window.close()}>
        {t('common.exit')}
      </Button>
      {newGame.error && (
        <p className="max-w-md text-center text-red-400">
          {String(newGame.error)}
        </p>
      )}
    </div>
  );
};
