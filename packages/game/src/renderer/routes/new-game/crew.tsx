import { createFileRoute } from '@tanstack/react-router';

import { CrewStep } from '../../views/wizards/NewGameWizard/CrewStep';

export const Route = createFileRoute('/new-game/crew')({
  component: CrewStep,
});
