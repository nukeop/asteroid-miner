import { Outlet } from '@tanstack/react-router';
import { type FC } from 'react';

import { GameShell } from '@asteroid-miner/ui';

import { ConnectedTopBar } from '../components/ConnectedTopBar';

export const GameLayout: FC = () => (
  <GameShell topBar={<ConnectedTopBar />}>
    <Outlet />
  </GameShell>
);
