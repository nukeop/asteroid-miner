export type ResourceGrade = {
  resourceId: string;
  grade: number;
};

export type AsteroidSite = {
  formationId: string;
  mass: number;
  composition: ResourceGrade[];
};

export type Asteroid = {
  id: string;
  zoneId: string;
  asteroidTypeId: string;
  massClassId: string;
  sites: AsteroidSite[];
};
