import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { type FC } from 'react';

import { routeTree } from './routeTree.gen';

const defaultRouter = createRouter({ routeTree });
const defaultQueryClient = new QueryClient();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof defaultRouter;
  }
}

type AppProps = {
  routerProp?: typeof defaultRouter;
  queryClientProp?: QueryClient;
};

export const App: FC<AppProps> = ({ routerProp, queryClientProp }) => (
  <QueryClientProvider client={queryClientProp ?? defaultQueryClient}>
    <RouterProvider router={routerProp ?? defaultRouter} />
  </QueryClientProvider>
);
