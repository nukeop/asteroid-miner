import '@asteroid-miner/tailwind-config';

import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'oklch(0.13 0.01 250)' },
        { name: 'surface', value: 'oklch(0.17 0.01 250)' },
      ],
    },
  },
};

export default preview;
