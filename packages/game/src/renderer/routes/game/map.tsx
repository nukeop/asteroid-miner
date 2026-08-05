import { createFileRoute } from '@tanstack/react-router';

import { MapView } from '../../views/MapView';

export const Route = createFileRoute('/game/map')({
  component: MapView,
});
