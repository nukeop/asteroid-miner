import { createFileRoute } from '@tanstack/react-router';

import { PlaceholderView } from '../../views/PlaceholderView';

export const Route = createFileRoute('/game/company')({
  component: () => <PlaceholderView tabKey="tabs.company" />,
});
