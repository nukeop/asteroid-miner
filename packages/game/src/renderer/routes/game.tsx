import { createFileRoute } from '@tanstack/react-router';

import { GameLayout } from '../views/GameLayout';

export const Route = createFileRoute('/game')({
  component: GameLayout,
});
