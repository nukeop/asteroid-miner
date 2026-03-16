import { createFileRoute } from '@tanstack/react-router';

import { DataBrowser } from '../../views/DataBrowser';

export const Route = createFileRoute('/game/data')({
  component: DataBrowser,
});
