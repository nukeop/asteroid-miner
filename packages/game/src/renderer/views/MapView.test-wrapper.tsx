import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRouter } from '@tanstack/react-router';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { Asteroid } from '@asteroid-miner/model';

import '@asteroid-miner/i18n';

import { App } from '../App';
import { routeTree } from '../routeTree.gen';
import { useDefinitionsStore } from '../stores/useDefinitionsStore';
import { useGameStateStore } from '../stores/useGameStateStore';
import { testDefinitions } from '../test/fixtures/definitions';

const user = userEvent.setup();

function placeholderAsteroid(zoneId: string, index: number): Asteroid {
  return {
    id: `${zoneId}-asteroid-${index}`,
    zoneId,
    asteroidTypeId: 'c_type',
    massClassId: 'small',
    sites: [],
  };
}

export const MapViewWrapper = {
  async mount() {
    useDefinitionsStore.setState({ definitions: testDefinitions });
    useGameStateStore.getState().initGame('starting');

    const history = createMemoryHistory({ initialEntries: ['/game/map'] });
    const router = createRouter({ routeTree, history });
    await router.load();

    render(<App routerProp={router} queryClientProp={new QueryClient()} />);
  },

  zone(name: string) {
    return screen.getByRole('button', { name });
  },

  connectionLabel(label: string) {
    return screen.getByText(label);
  },

  async selectZone(name: string) {
    await user.click(this.zone(name));
  },

  get detailPanel() {
    return screen.getByTestId('zone-detail-panel');
  },

  queryDetailPanel() {
    return screen.queryByTestId('zone-detail-panel');
  },

  setDiscoveredAsteroids(zoneId: string, count: number) {
    act(() => {
      const { state } = useGameStateStore.getState();
      useGameStateStore.setState({
        state: {
          ...state!,
          zones: {
            ...state!.zones,
            [zoneId]: {
              ...state!.zones[zoneId],
              asteroids: Array.from({ length: count }, (_, index) =>
                placeholderAsteroid(zoneId, index),
              ),
            },
          },
        },
      });
    });
  },
};
