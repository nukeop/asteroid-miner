import { createFileRoute } from '@tanstack/react-router';

import { PlaceholderView } from '../../views/PlaceholderView';

export const Route = createFileRoute('/game/map')({
  component: () => <PlaceholderView tabKey="tabs.map" />,
});
