export type SkillState = {
  level: number;
  xp: number;
};

export type Pawn = {
  id: string;
  faction: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nickname: string | null;
  sex: 'Male' | 'Female';
  age: number;
  origin: string;
  career: string;
  skills: Record<string, SkillState>;
  traits: string[];
};
