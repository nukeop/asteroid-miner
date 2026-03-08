import '@asteroid-miner/tailwind-config';

import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'oklch(0.1324 0.0156 42.5)' },
        { name: 'surface', value: 'oklch(0.1763 0.0371 75.5)' },
      ],
    },
  },
};

export default preview;
