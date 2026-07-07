import type { Definitions } from '../definitions';
import type { Pawn } from './pawn';
import type { Zone } from './zone';

export type GameState = {
  scenarioId: string;
  defs: Definitions;
  crew: Record<string, Pawn>;
  crewOrder: string[];
  zones: Record<string, Zone>;
};
