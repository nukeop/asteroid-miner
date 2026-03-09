import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

import { GameShell, type TabDefinition } from '@asteroid-miner/ui';

const tabs: TabDefinition[] = [
  { id: 'map', label: 'Map', shortcut: '1', to: '/map' },
  { id: 'company', label: 'Company', shortcut: '2', to: '/company' },
  { id: 'market', label: 'Market', shortcut: '3', to: '/market' },
  { id: 'missions', label: 'Missions', shortcut: '4', to: '/missions' },
  { id: 'hiring', label: 'Hiring', shortcut: '5', to: '/hiring' },
  { id: 'rivals', label: 'Rivals', shortcut: '6', to: '/rivals' },
];

const withRouter: Decorator = (Story) => {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Story />
      </>
    ),
  });

  const childRoutes = tabs.map((tab) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: tab.to,
    }),
  );

  const router = createRouter({
    routeTree: rootRoute.addChildren(childRoutes),
    history: createMemoryHistory({ initialEntries: ['/map'] }),
  });

  return <RouterProvider router={router} />;
};

const meta: Meta<typeof GameShell> = {
  title: 'Game/Layout',
  component: GameShell,
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof GameShell>;

export const GameView: Story = {
  args: {
    companyName: 'Kuiper Industrial',
    topBarLabels: {
      day: 'Day 47',
      credits: '12,450 CR',
    },
    tabs,
    children: (
      <h1 className="flex h-full items-center justify-center text-2xl">Body</h1>
    ),
  },
};
