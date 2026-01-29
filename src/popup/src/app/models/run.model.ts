import { PuzzleId } from '@extension/shared/models';

export interface IRun {
  timestamp: number;

  // puzzles
  solved: PuzzleId[];
  unsolved: PuzzleId[];
  reviewed: PuzzleId[];
}
