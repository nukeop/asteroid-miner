import { createFileRoute } from '@tanstack/react-router';

import { ScenarioStep } from '../../views/wizards/NewGameWizard/ScenarioStep';

export const Route = createFileRoute('/new-game/scenario')({
  component: ScenarioStep,
});
