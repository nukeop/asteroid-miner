import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@asteroid-miner/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="primary" size="sm">
          Primary SM
        </Button>
        <Button variant="secondary" size="sm">
          Secondary SM
        </Button>
        <Button variant="ghost" size="sm">
          Ghost SM
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="ghost" disabled>
          Disabled
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="primary" loading>
          Primary
        </Button>
        <Button variant="secondary" loading>
          Secondary
        </Button>
        <Button variant="ghost" loading>
          Ghost
        </Button>
      </div>
    </div>
  ),
};
