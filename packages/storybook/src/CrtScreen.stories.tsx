import type { Meta, StoryObj } from '@storybook/react-vite';

import { CrtScreen } from '@asteroid-miner/ui';

const meta: Meta<typeof CrtScreen> = {
  title: 'Components/CrtScreen',
  component: CrtScreen,
  tags: ['autodocs'],
  argTypes: {
    palette: {
      control: 'select',
      options: ['amber', 'green'],
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="bg-[#0a0a0a] p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CrtScreen>;

export const Default: Story = {
  args: {
    children: (
      <p>
        Ore extraction on Asteroid VX-448 is holding steady at 12.4 tonnes per
        cycle. The main drill array shows nominal wear, and the refinery queue
        has capacity for another 36 hours before we need to rotate the
        centrifuge filters.
      </p>
    ),
  },
};

export const Green: Story = {
  args: {
    palette: 'green',
    children: (
      <p>
        Proximity alert: unregistered vessel detected in Sector 7-G. Transponder
        query returned no match. Recommend activating perimeter drones and
        switching to defensive mining formation. All non-essential crew report
        to the inner hull.
      </p>
    ),
  },
};

export const WithHeaders: Story = {
  args: {
    children: (
      <>
        <h1 className="mb-3 text-2xl">Mining Operations Report</h1>
        <h3 className="mb-2 text-lg">Sector VX-448 / Shift 14</h3>
        <h5 className="mb-4 text-sm opacity-70">
          Filed by: Chief Surveyor Okafor
        </h5>
        <p>
          The forward drill assembly punched through the silicate layer at 0340
          hours. Below it we found a vein of iridium-rich ore running
          approximately 200 meters along the asteroid's minor axis. Spectral
          analysis confirms grade-A purity. This is the best find we've had
          since the Ceres contract.
        </p>
      </>
    ),
  },
};

export const SideBySide: Story = {
  render: () => {
    const content = (
      <>
        <h3 className="mb-2 text-lg">System Status</h3>
        <p className="mb-2">Drill array: ONLINE</p>
        <p className="mb-2">Refinery: 78% capacity</p>
        <p className="mb-2">Hull integrity: 94%</p>
        <p>Crew: 24 active, 8 resting</p>
      </>
    );

    return (
      <div className="grid grid-cols-2 gap-6">
        <CrtScreen palette="amber">{content}</CrtScreen>
        <CrtScreen palette="green">{content}</CrtScreen>
      </div>
    );
  },
};

export const Dense: Story = {
  args: {
    className: 'max-h-80 overflow-y-auto',
    children: (
      <>
        <h1 className="mb-3 text-2xl">Asteroid Mining Field Manual</h1>

        <h3 className="mb-2 text-lg">Section 1: Pre-Extraction Survey</h3>
        <p className="mb-3">
          Before any drill makes contact with the surface, a full spectral sweep
          is mandatory. Map the asteroid's composition layer by layer. Iron and
          nickel are common, but the real prize is platinum-group metals buried
          deeper. Skip the survey and you risk punching into a gas pocket or,
          worse, a structurally hollow core that collapses under drill pressure.
        </p>

        <h3 className="mb-2 text-lg">Section 2: Extraction Protocol</h3>
        <p className="mb-3">
          Run the primary drill at 60% torque until you clear the regolith
          layer. Switch to the diamond-tip array for hard rock. Monitor
          vibration sensors constantly; a resonance spike above 4.2 kHz means
          you're about to hit a fault line. Pull back, reposition 15 meters
          laterally, and try again.
        </p>

        <h3 className="mb-2 text-lg">Section 3: Ore Processing</h3>
        <p className="mb-3">
          Raw ore feeds into the centrifuge at a maximum rate of 2 tonnes per
          hour. The separator pulls heavy metals to the outer ring while
          silicates and waste collect in the center basin. Flush the basin every
          4 hours or it clogs the intake valves.
        </p>

        <h3 className="mb-2 text-lg">Section 4: Hazard Checklist</h3>
        <ul className="mb-3 list-disc space-y-1 pl-5">
          <li>Check radiation levels before EVA (max 50 mSv/shift)</li>
          <li>Inspect tether anchors for micro-fractures</li>
          <li>Verify comm relay alignment with base station</li>
          <li>Log all explosive charge placements in the blast register</li>
          <li>Keep emergency propellant reserves above 30%</li>
          <li>Never drill within 50m of a fuel cache</li>
        </ul>

        <h3 className="mb-2 text-lg">Section 5: Shift Handoff</h3>
        <p>
          Outgoing crew logs all equipment states, active drill coordinates, and
          pending refinery batches. Incoming crew verifies the log, runs a
          5-minute diagnostic on all primary systems, and confirms comms with
          mission control before assuming operational authority. No exceptions.
        </p>
      </>
    ),
  },
};
