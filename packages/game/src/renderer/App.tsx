import { useEffect, useState } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';
import { GameShell, type GameShellLabels } from '@asteroid-miner/ui';

import init, { ping } from '../../../simulation/pkg/asteroid_miner_simulation';

declare global {
  interface Window {
    electronAPI: {
      saveGame: (data: string) => Promise<{ ok: boolean }>;
      loadGame: () => Promise<{ ok: boolean; data: string | null }>;
    };
  }
}

// TODO: remove hardcoded stuff
const STARTING_CREDITS = 50_000;
const STARTING_DAY = 1;

export function App() {
  const { t } = useTranslation();
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        ping();
        setWasmReady(true);
      })
      .catch((err) => {
        console.error('WASM init failed:', err);
      });
  }, []);

  const labels: GameShellLabels = {
    topBar: {
      day: t('common.day', { count: STARTING_DAY }),
      credits: t('common.credits', {
        amount: STARTING_CREDITS.toLocaleString(),
      }),
    },
    tabs: {
      map: t('tabs.map'),
      company: t('tabs.company'),
      market: t('tabs.market'),
      missions: t('tabs.missions'),
      hiring: t('tabs.hiring'),
      rivals: t('tabs.rivals'),
    },
  };

  if (!wasmReady) {
    return null;
  }

  return <GameShell companyName="Kuiper Industrial" labels={labels} />;
}
