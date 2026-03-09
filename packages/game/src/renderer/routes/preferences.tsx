import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { Button } from '@asteroid-miner/ui';

export const Route = createFileRoute('/preferences')({
  component: Preferences,
});

function Preferences() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen flex-col items-center justify-center">
      <h1 className="font-heading text-3xl tracking-widest uppercase">
        Preferences
      </h1>
      <div className="absolute bottom-8 left-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          Back
        </Button>
      </div>
    </div>
  );
}
