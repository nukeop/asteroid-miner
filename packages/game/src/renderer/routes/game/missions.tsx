import { createFileRoute } from '@tanstack/react-router';

import { PlaceholderView } from '../../views/PlaceholderView';

export const Route = createFileRoute('/game/missions')({
  component: () => <PlaceholderView tabKey="tabs.missions" />,
});
