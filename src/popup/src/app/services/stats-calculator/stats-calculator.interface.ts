import { RunMetricStats } from '../../models';

export interface IRunStatCalculator<T> {
  calculateMetricStats: (runs: T[]) => RunMetricStats;
}
