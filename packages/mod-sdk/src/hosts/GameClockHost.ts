export type GameClockHost = {
  getTurn(): number;
  advanceDay(): void;
  subscribe(listener: (turn: number) => void): () => void;
};
