import { IStorm } from '@extension/shared/models';
import { IStormGroupStats } from './storm-group-stats.model';

export interface IGroupedStorm {
  label: string;
  timestamp: number;
  runs: IStorm[];
  metric: IStormGroupStats;
}
