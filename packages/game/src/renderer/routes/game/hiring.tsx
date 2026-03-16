import { createFileRoute } from '@tanstack/react-router';

import { PlaceholderView } from '../../views/PlaceholderView';

export const Route = createFileRoute('/game/hiring')({
  component: () => <PlaceholderView tabKey="tabs.hiring" />,
});
