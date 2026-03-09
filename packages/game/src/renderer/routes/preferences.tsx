import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/preferences')({
  component: Preferences,
});

function Preferences() {
  return <div>Preferences</div>;
}
