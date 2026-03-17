import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

import { useGameClockStore } from '../stores/useGameClockStore';

export function useNewGame() {
  const navigate = useNavigate();

  const startNewGame = useCallback(() => {
    useGameClockStore.getState().reset();
    navigate({ to: '/game/map' });
  }, [navigate]);

  return { startNewGame };
}
