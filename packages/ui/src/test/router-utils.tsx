import type { AnyRouter } from '@tanstack/react-router';
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import {
  render,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react';
import { act } from 'react';
import type { ReactElement } from 'react';

type RenderWithRouterResult = RenderResult & { router: AnyRouter };

export async function renderWithRouter(
  ui: ReactElement,
  {
    initialLocation = '/',
    routes = [] as string[],
    ...options
  }: {
    initialLocation?: string;
    routes?: string[];
  } & Omit<RenderOptions, 'wrapper'> = {},
): Promise<RenderWithRouterResult> {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <Outlet />
        {ui}
      </>
    ),
  });

  const childRoutes = routes.map((path) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => <div>{path}</div>,
    }),
  );

  const router = createRouter({
    routeTree: rootRoute.addChildren(childRoutes),
    history: createMemoryHistory({ initialEntries: [initialLocation] }),
  });

  await router.load();

  let result: RenderResult;
  await act(async () => {
    result = render(<RouterProvider router={router} />, options);
  });

  return {
    ...result!,
    router,
  };
}
