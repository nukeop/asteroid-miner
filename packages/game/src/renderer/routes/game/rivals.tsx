import { createFileRoute } from '@tanstack/react-router';

import { PlaceholderView } from '../../views/PlaceholderView';

export const Route = createFileRoute('/game/rivals')({
  component: () => <PlaceholderView tabKey="tabs.rivals" />,
});
