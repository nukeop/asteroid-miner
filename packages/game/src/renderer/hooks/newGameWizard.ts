import { createWizard } from './createWizard';

type NewGameWizardState = {
  scenarioId: string | null;
};

export const { useStore: useNewGameWizardStore, useWizard: useNewGameWizard } =
  createWizard<NewGameWizardState>({
    routes: ['/new-game/scenario', '/new-game/crew'],
    initialState: { scenarioId: null },
    onFinishRoute: '/game/map',
  });
