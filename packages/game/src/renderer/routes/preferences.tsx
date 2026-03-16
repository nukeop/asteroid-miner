import { createFileRoute } from '@tanstack/react-router';

import { Preferences } from '../views/Preferences';

export const Route = createFileRoute('/preferences')({
  component: Preferences,
});
