import { createFileRoute } from '@tanstack/react-router';

import { useTranslation } from '@asteroid-miner/i18n';

export const Route = createFileRoute('/game/company')({
  component: CompanyView,
});

function CompanyView() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full items-center justify-center">
      <span className="font-heading text-amber-dim text-2xl tracking-widest uppercase">
        {t('tabs.company')}
      </span>
    </div>
  );
}
