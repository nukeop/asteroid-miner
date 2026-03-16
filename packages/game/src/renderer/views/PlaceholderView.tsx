import { type FC } from 'react';

import { useTranslation } from '@asteroid-miner/i18n';

type PlaceholderViewProps = {
  tabKey: string;
};

export const PlaceholderView: FC<PlaceholderViewProps> = ({ tabKey }) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full items-center justify-center">
      <span className="font-heading text-amber-dim text-2xl tracking-widest uppercase">
        {t(tabKey)}
      </span>
    </div>
  );
};
