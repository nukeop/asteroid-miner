import { createFileRoute, Outlet } from '@tanstack/react-router';

import { useTranslation } from '@asteroid-miner/i18n';
import { GameShell, type TabDefinition } from '@asteroid-miner/ui';

export const Route = createFileRoute('/game')({
  component: GameLayout,
});

function GameLayout() {
  const { t } = useTranslation();

  const tabs: TabDefinition[] = [
    { id: 'map', label: t('tabs.map'), shortcut: '1', to: '/game/map' },
    {
      id: 'company',
      label: t('tabs.company'),
      shortcut: '2',
      to: '/game/company',
    },
    {
      id: 'market',
      label: t('tabs.market'),
      shortcut: '3',
      to: '/game/market',
    },
    {
      id: 'missions',
      label: t('tabs.missions'),
      shortcut: '4',
      to: '/game/missions',
    },
    {
      id: 'hiring',
      label: t('tabs.hiring'),
      shortcut: '5',
      to: '/game/hiring',
    },
    {
      id: 'rivals',
      label: t('tabs.rivals'),
      shortcut: '6',
      to: '/game/rivals',
    },
  ];

  return (
    <GameShell
      companyName="Kuiper Industrial"
      topBarLabels={{
        day: t('common.day', { count: 1 }),
        credits: t('common.credits', { amount: '10,000' }),
      }}
      tabs={tabs}
    >
      <Outlet />
    </GameShell>
  );
}
