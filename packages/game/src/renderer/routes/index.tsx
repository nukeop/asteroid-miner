import { createFileRoute } from '@tanstack/react-router';

import { MainMenu } from '../views/MainMenu';

export const Route = createFileRoute('/')({
  component: MainMenu,
});
