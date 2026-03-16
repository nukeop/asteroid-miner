import { createFileRoute, redirect } from '@tanstack/react-router';

import { useDefinitionsStore } from '../stores';
import { GameLayout } from '../views/GameLayout';

export const Route = createFileRoute('/game')({
  beforeLoad: () => {
    if (!useDefinitionsStore.getState().definitions) {
      throw redirect({ to: '/' });
    }
  },
  component: GameLayout,
});
