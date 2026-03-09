import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithRouter } from '../../test/router-utils';
import { TabBar } from './TabBar';
import type { TabDefinition } from './types';

const tabs: TabDefinition[] = [
  { id: 'map', label: 'Map', shortcut: '1', to: '/map' },
  { id: 'company', label: 'Company', shortcut: '2', to: '/company' },
  { id: 'market', label: 'Market', shortcut: '3', to: '/market' },
  { id: 'missions', label: 'Missions', shortcut: '4', to: '/missions' },
  { id: 'hiring', label: 'Hiring', shortcut: '5', to: '/hiring' },
  { id: 'rivals', label: 'Rivals', shortcut: '6', to: '/rivals' },
];

const tabRoutes = tabs.map((t) => t.to);

describe('TabBar', () => {
  it('renders all six tabs', async () => {
    await renderWithRouter(<TabBar tabs={tabs} />, { routes: tabRoutes });

    expect(screen.getAllByRole('tab')).toHaveLength(6);
  });

  it('navigates when a tab is clicked', async () => {
    const { router } = await renderWithRouter(<TabBar tabs={tabs} />, {
      initialLocation: '/map',
      routes: tabRoutes,
    });

    await userEvent.click(screen.getByRole('tab', { name: /market/i }));
    expect(router.state.location.pathname).toBe('/market');
  });

  it('marks the active tab as selected', async () => {
    await renderWithRouter(<TabBar tabs={tabs} />, {
      initialLocation: '/missions',
      routes: tabRoutes,
    });

    expect(screen.getByRole('tab', { name: /missions/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: /map/i })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('(Snapshot) renders correctly', async () => {
    await renderWithRouter(<TabBar tabs={tabs} />, {
      initialLocation: '/map',
      routes: tabRoutes,
    });
    expect(screen.getByRole('navigation')).toMatchSnapshot();
  });
});
