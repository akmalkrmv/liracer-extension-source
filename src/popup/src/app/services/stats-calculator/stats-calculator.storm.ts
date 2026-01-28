import { IStorm } from '@extension/shared/models';
import { IStormGroupStats, MetricSummary, StormGroupStats } from '../../models';
import { IRunStatCalculator } from './stats-calculator.interface';

export class StormStatCalculator implements IRunStatCalculator<IStorm> {
  public calculateMetricStats(runs: IStorm[]): IStormGroupStats {
    if (!runs?.length) {
      return new StormGroupStats();
    }

    return new StormGroupStats(
      // puzzles
      new MetricSummary(runs.map((run: IStorm) => this.length(run.solved))),
      new MetricSummary(runs.map((run: IStorm) => this.length(run.unsolved))),
      new MetricSummary(runs.map((run: IStorm) => this.length(run.reviewed))),
      new MetricSummary(runs.map((run: IStorm) => this.lengths(run.unsolved, run.reviewed))),

      // stats
      new MetricSummary(runs.map((run: IStorm) => run.score)),
      new MetricSummary(runs.map((run: IStorm) => run.moves)),
      new MetricSummary(runs.map((run: IStorm) => run.accuracy)),
      new MetricSummary(runs.map((run: IStorm) => run.combo)),
      new MetricSummary(runs.map((run: IStorm) => run.time)),
      new MetricSummary(runs.map((run: IStorm) => run.timePerMove)),
      new MetricSummary(runs.map((run: IStorm) => run.highestSolved)),
    );
  }

  private lengths<T>(...array: Array<T>[]) {
    return array.reduce((sum: number, arr: T[]) => sum + this.length(arr), 0);
  }

  private length<T>(array: Array<T>) {
    return array?.length ?? 0;
  }
}
