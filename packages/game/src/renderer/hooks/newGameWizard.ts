import { createWizard } from './createWizard';

type NewGameWizardState = {
  scenarioId: string | null;
};

export const { useStore: useNewGameWizardStore, useWizard: useNewGameWizard } =
  createWizard<NewGameWizardState>({
    routes: ['/new-game/scenario', '/new-game/crew'],
    initialState: { scenarioId: null },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onFinish: (_state) => {
      // TODO: initialize game from wizard state, navigate to game map
    },
  });
