const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR;
const START_YEAR = 2022;

export type GameDate = {
  year: number;
  month: number;
  day: number;
};

export function turnToDate(turn: number): GameDate {
  const elapsed = turn - 1;
  return {
    year: Math.floor(elapsed / DAYS_PER_YEAR) + START_YEAR,
    month: Math.floor((elapsed % DAYS_PER_YEAR) / DAYS_PER_MONTH) + 1,
    day: (elapsed % DAYS_PER_MONTH) + 1,
  };
}
