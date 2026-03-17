import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithRouter } from '../../test/router-utils';
import type { TabDefinition } from '../TabBar/types';
import { GameShell } from './GameShell';

const tabs: TabDefinition[] = [
  { id: 'map', label: 'Map', shortcut: '1', to: '/map' },
  { id: 'company', label: 'Company', shortcut: '2', to: '/company' },
  { id: 'market', label: 'Market', shortcut: '3', to: '/market' },
  { id: 'missions', label: 'Missions', shortcut: '4', to: '/missions' },
];

const tabRoutes = tabs.map((t) => t.to);

describe('GameShell', () => {
  it('navigates when clicking a tab', async () => {
    const { router } = await renderWithRouter(
      <GameShell topBar={<span>Top bar content</span>} tabs={tabs}>
        <div>page content</div>
      </GameShell>,
      { initialLocation: '/map', routes: tabRoutes },
    );

    await userEvent.click(screen.getByRole('tab', { name: /missions/i }));
    expect(router.state.location.pathname).toBe('/missions');
  });

  it('renders children in the main area', async () => {
    await renderWithRouter(
      <GameShell topBar={<span>Top bar content</span>} tabs={tabs}>
        <div>Star chart goes here</div>
      </GameShell>,
      { initialLocation: '/map', routes: tabRoutes },
    );

    expect(screen.getByRole('main')).toHaveTextContent('Star chart goes here');
  });

  it('(Snapshot) renders with default props', async () => {
    const { container } = await renderWithRouter(
      <GameShell topBar={<span>Top bar content</span>} tabs={tabs}>
        <div>page content</div>
      </GameShell>,
      { initialLocation: '/map', routes: tabRoutes },
    );
    expect(container).toMatchSnapshot();
  });
});
