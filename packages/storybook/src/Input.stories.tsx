import type { Meta, StoryObj } from '@storybook/react-vite';

import { CrtScreen, Input } from '@asteroid-miner/ui';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

const Row = ({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <div className="text-amber-text text-xs tracking-wide uppercase">
      {caption}
    </div>
    {children}
  </div>
);

export const AllVariants: Story = {
  render: () => (
    <CrtScreen>
      <div className="flex flex-col gap-6 p-8">
        <Row caption="Small">
          <Input size="sm" placeholder="Enter designation..." />
        </Row>
        <Row caption="Medium (default)">
          <Input placeholder="Enter designation..." />
        </Row>
        <Row caption="Large">
          <Input size="lg" placeholder="Enter designation..." />
        </Row>
        <Row caption="With value">
          <Input size="lg" defaultValue="Sergei Viktorovich Morozov" />
        </Row>
        <Row caption="Disabled">
          <Input size="lg" disabled defaultValue="Classified" />
        </Row>
      </div>
    </CrtScreen>
  ),
};
