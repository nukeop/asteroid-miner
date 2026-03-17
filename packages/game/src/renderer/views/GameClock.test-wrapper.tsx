import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@asteroid-miner/i18n';

import { App } from '../App';
import { routeTree } from '../routeTree.gen';
import { useGameClockStore } from '../stores/useGameClockStore';

const user = userEvent.setup();

export const GameClockWrapper = {
  async mount() {
    const history = createMemoryHistory({ initialEntries: ['/game/map'] });
    const router = createRouter({ routeTree, history });
    await router.load();

    render(<App routerProp={router} queryClientProp={new QueryClient()} />);
  },

  get topBarDate() {
    return screen.getByTestId('top-bar-date');
  },

  nextDay: {
    async click() {
      await user.click(screen.getByRole('button', { name: /next day/i }));
    },
  },

  setTurn(turn: number) {
    useGameClockStore.setState({ turn });
  },
};
