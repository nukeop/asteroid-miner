import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game/map')({
  component: MapView,
});

function MapView() {
  return (
    <div className="flex h-full items-center justify-center">
      <span className="font-heading text-amber-dim text-2xl tracking-widest uppercase">
        Star Map
      </span>
    </div>
  );
}
