import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@asteroid-miner/i18n';

import { App } from '../App';
import { routeTree } from '../routeTree.gen';
import { useDefinitionsStore } from '../stores/useDefinitionsStore';
import { useGameClockStore } from '../stores/useGameClockStore';
import { useGameStateStore } from '../stores/useGameStateStore';
import { testDefinitions } from '../test/fixtures/definitions';

const user = userEvent.setup();

export const GameClockWrapper = {
  async mount() {
    useGameClockStore.getState().reset();
    useDefinitionsStore.setState({ definitions: testDefinitions });
    useGameStateStore.getState().initGame('starting');

    const history = createMemoryHistory({ initialEntries: ['/game/map'] });
    const router = createRouter({ routeTree, history });
    await router.load();

    render(<App routerProp={router} queryClientProp={new QueryClient()} />);
  },

  get topBarDate() {
    return screen.getByTestId('top-bar-date');
  },

  advanceDay: {
    async click() {
      await user.click(screen.getByRole('button', { name: /advance day/i }));
    },
  },

  setTurn(turn: number) {
    act(() => {
      useGameClockStore.setState({ turn });
    });
  },
};
