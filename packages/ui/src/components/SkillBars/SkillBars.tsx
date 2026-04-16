import { type ComponentProps, type FC } from 'react';

import { cn } from '../../utils';
import { StatBar } from '../StatBar';

type Skill = {
  id: string;
  name: string;
  level: number;
};

export type SkillBarsProps = ComponentProps<'div'> & {
  skills: Skill[];
  maxLevel?: number;
};

export const SkillBars: FC<SkillBarsProps> = ({
  skills,
  maxLevel = 20,
  className,
  ...props
}) => (
  <div
    className={cn('grid gap-x-6 gap-y-1', className)}
    style={{
      gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
    }}
    {...props}
  >
    {skills.map((skill) => (
      <StatBar
        key={skill.id}
        label={skill.name}
        value={skill.level}
        max={maxLevel}
      />
    ))}
  </div>
);
