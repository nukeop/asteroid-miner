import { useNewGameWizard } from './newGameWizard';

export function useNewGame() {
  const { start } = useNewGameWizard();
  return { startNewGame: start };
}
