import { createFileRoute } from '@tanstack/react-router';

import { PlaceholderView } from '../../views/PlaceholderView';

export const Route = createFileRoute('/game/market')({
  component: () => <PlaceholderView tabKey="tabs.market" />,
});
