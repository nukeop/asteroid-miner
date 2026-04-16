import type { Meta, StoryObj } from '@storybook/react-vite';

import { CrtScreen, SkillBars } from '@asteroid-miner/ui';

const skills = [
  { id: 'mining', name: 'Mining', level: 14 },
  { id: 'geology', name: 'Geology', level: 8 },
  { id: 'refining', name: 'Refining', level: 3 },
  { id: 'engineering', name: 'Engineering', level: 5 },
  { id: 'cybernetics', name: 'Cybernetics', level: 0 },
  { id: 'cosmonautics', name: 'Cosmonautics', level: 6 },
  { id: 'navigation', name: 'Navigation', level: 2 },
  { id: 'medicine', name: 'Medicine', level: 0 },
  { id: 'research', name: 'Research', level: 0 },
  { id: 'materials_science', name: 'Materials Science', level: 1 },
  { id: 'blat', name: 'Blat', level: 0 },
  { id: 'leadership', name: 'Leadership', level: 4 },
  { id: 'construction', name: 'Construction', level: 7 },
  { id: 'bureaucracy', name: 'Bureaucracy', level: 0 },
];

const meta: Meta<typeof SkillBars> = {
  title: 'Components/SkillBars',
  component: SkillBars,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SkillBars>;

export const Default: Story = {
  render: () => (
    <CrtScreen>
      <SkillBars skills={skills} />
    </CrtScreen>
  ),
};
