import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: MainMenu,
});

function MainMenu() {
  return <div>Main Menu</div>;
}
