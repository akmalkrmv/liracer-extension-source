import { IRace } from '@extension/shared/models';
import { IRunStatCalculator } from './stats-calculator.interface';
import { IRaceGroupStats, MetricSummary, RaceGroupStats } from '../../models';

export class RacerStatsCalculator implements IRunStatCalculator<IRace> {
  public calculateMetricStats(runs: IRace[]): IRaceGroupStats {
    if (!runs?.length) {
      return new RaceGroupStats();
    }

    return new RaceGroupStats(
      // puzzles
      new MetricSummary(runs.map((run: IRace) => this.length(run.solved))),
      new MetricSummary(runs.map((run: IRace) => this.length(run.unsolved))),
      new MetricSummary(runs.map((run: IRace) => this.length(run.reviewed))),
      new MetricSummary(runs.map((run: IRace) => this.lengths(run.unsolved, run.reviewed))),
      
      // stats
      new MetricSummary(runs.map((run: IRace) => run.score)),
      new MetricSummary(runs.map((run: IRace) => run.rank)),
      new MetricSummary(runs.map((run: IRace) => run.totalPlayers)),
    );
  }

  private lengths<T>(...array: Array<T>[]) {
    return array.reduce((sum: number, arr: T[]) => sum + this.length(arr), 0);
  }

  private length<T>(array: Array<T>) {
    return array?.length ?? 0;
  }
}
