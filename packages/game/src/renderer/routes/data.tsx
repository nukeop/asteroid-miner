import { createFileRoute } from '@tanstack/react-router';

import { DataBrowser } from '../views/DataBrowser';

export const Route = createFileRoute('/data')({
  component: DataBrowser,
});
