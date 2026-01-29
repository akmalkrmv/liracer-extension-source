import {PuzzleId} from './common';

export interface IRun {
  timestamp: number;

  // puzzles
  solved: PuzzleId[];
  unsolved: PuzzleId[];
  reviewed: PuzzleId[];
}
