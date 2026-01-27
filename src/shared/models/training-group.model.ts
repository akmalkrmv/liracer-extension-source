import {PuzzleId} from './common';

export type TrainingGroupType = 'racer' | 'storm';

export interface TrainingGroup {
  type: TrainingGroupType;
  date: number;
  puzzles: PuzzleId[];
}
