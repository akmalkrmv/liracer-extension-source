import { IRaceGroupStats } from './racer-group-stats.model';
import { IStormGroupStats } from './storm-group-stats.model';

export type RunMetricStats = IRaceGroupStats | IStormGroupStats;
export type GroupingStrategy = 'relative' | 'static' | 'day-name' | 'date';

export interface IRunBase {
  timestamp: number;
}

export interface IRunGroupBase<T extends IRunBase> {
  timestamp: number;
  label: string;
  runs: T[];
  metric?: RunMetricStats;
}

export interface IGroupingConfig {
  strategy: GroupingStrategy;
  labeling: GroupingStrategy;
  sortDescending?: boolean;
}

export const DEFAULT_CONFIG: IGroupingConfig = {
  strategy: 'relative',
  labeling: 'relative',
  sortDescending: true,
} as const;
