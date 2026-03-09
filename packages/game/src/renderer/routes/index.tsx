import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { Button } from '@asteroid-miner/ui';

export const Route = createFileRoute('/')({
  component: MainMenu,
});

function MainMenu() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-heading mb-8 text-4xl tracking-widest uppercase">
        Asteroid Miner
      </h1>
      <Button className="w-48" onClick={() => {}}>
        New Game
      </Button>
      <Button
        className="w-48"
        variant="secondary"
        onClick={() => navigate({ to: '/preferences' })}
      >
        Preferences
      </Button>
      <Button className="w-48" variant="ghost" onClick={() => window.close()}>
        Exit
      </Button>
    </div>
  );
}
