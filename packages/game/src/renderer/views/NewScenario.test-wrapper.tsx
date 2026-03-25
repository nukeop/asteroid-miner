import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@asteroid-miner/i18n';

import { App } from '../App';
import { routeTree } from '../routeTree.gen';
import { useDefinitionsStore } from '../stores/useDefinitionsStore';
import { testDefinitions } from '../test/fixtures/definitions';

const user = userEvent.setup();

export const NewScenarioWrapper = {
  async mount() {
    useDefinitionsStore.setState({ definitions: testDefinitions });

    const history = createMemoryHistory({ initialEntries: ['/'] });
    const router = createRouter({ routeTree, history });
    await router.load();

    render(<App routerProp={router} queryClientProp={new QueryClient()} />);

    await user.click(screen.getByRole('button', { name: /new game/i }));
    await screen.findByTestId('scenario-selection');
  },

  get gameLayout() {
    return screen.getByTestId('game-layout');
  },

  scenarioSelection: {
    get view() {
      return screen.getByTestId('scenario-selection');
    },

    async selectScenario(name: string) {
      await user.click(
        screen
          .getAllByTestId('scenario-name')
          .find((el) => el.textContent === name)!,
      );
    },

    async clickNext() {
      await user.click(screen.getByRole('button', { name: /next/i }));
      await screen.findByTestId('crew-review');
    },

    async clickBack() {
      await user.click(screen.getByRole('button', { name: /back/i }));
    },
  },

  crewReview: {
    get view() {
      return screen.getByTestId('crew-review');
    },

    get selectedCrewDetail() {
      return screen.getByTestId('crew-detail');
    },

    async selectCrewMember(name: string) {
      await user.click(
        screen
          .getAllByTestId('crew-list-name')
          .find((el) => el.textContent?.includes(name))!,
      );
    },

    async clickReroll() {
      await user.click(screen.getByRole('button', { name: /reroll/i }));
    },

    async clickBack() {
      await user.click(screen.getByRole('button', { name: /back/i }));
      await screen.findByTestId('scenario-selection');
    },

    async clickStart() {
      await user.click(screen.getByRole('button', { name: /start/i }));
    },
  },
};
