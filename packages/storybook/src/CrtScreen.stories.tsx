import type { Meta, StoryObj } from '@storybook/react-vite';

import { CrtScreen } from '@asteroid-miner/ui';

const meta: Meta<typeof CrtScreen> = {
  title: 'Components/CrtScreen',
  component: CrtScreen,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-amber-deep p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CrtScreen>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-6">
        <CrtScreen palette="amber">
          <h3 className="mb-2 text-lg">Amber / System Status</h3>
          <p className="mb-2">Drill array: ONLINE</p>
          <p className="mb-2">Refinery: 78% capacity</p>
          <p className="mb-2">Hull integrity: 94%</p>
          <p>Crew: 24 active, 8 resting</p>
        </CrtScreen>

        <CrtScreen palette="green">
          <h3 className="mb-2 text-lg">Green / Proximity Alert</h3>
          <p className="mb-2">
            Unregistered vessel detected in Sector 7-G. Transponder query
            returned no match.
          </p>
          <p>Recommend activating perimeter drones.</p>
        </CrtScreen>
      </div>

      <CrtScreen>
        <h1 className="mb-3 text-2xl">Mining Operations Report</h1>
        <h3 className="mb-2 text-lg">Sector VX-448 / Shift 14</h3>
        <h5 className="mb-4 text-sm opacity-70">
          Filed by: Chief Surveyor Okafor
        </h5>
        <p className="mb-4">
          The forward drill assembly punched through the silicate layer at 0340
          hours. Below it we found a vein of iridium-rich ore running
          approximately 200 meters along the asteroid's minor axis. Spectral
          analysis confirms grade-A purity.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Check radiation levels before EVA (max 50 mSv/shift)</li>
          <li>Inspect tether anchors for micro-fractures</li>
          <li>Verify comm relay alignment with base station</li>
          <li>Keep emergency propellant reserves above 30%</li>
        </ul>
      </CrtScreen>
    </div>
  ),
};
