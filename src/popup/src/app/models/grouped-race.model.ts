import { IRace } from '@extension/shared/models';
import { IRaceGroupStats } from './racer-group-stats.model';

export interface IGroupedRace {
  label: string;
  timestamp: number;
  runs: IRace[];
  metric: IRaceGroupStats;
}
