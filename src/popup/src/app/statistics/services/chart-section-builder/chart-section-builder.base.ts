import { RunMetricStats } from '../../../models';
import { sum } from '../../../services/utils';
import { ILineChartSection, LineChartSection } from '../../models';
import { DatasetTypes } from '../chart-dataset-builder';
import { metricSeries } from '../to-metric-series';
import { IChartSectionsBuilder } from './chart-section-builder.interface';

export abstract class BaseChartSectionsBuilder<T> implements IChartSectionsBuilder<T> {
  public abstract build(groups: T[]): ILineChartSection[];

  protected runs(labels: string[], totalRuns: number[]) {
    return new LineChartSection('Runs', labels)
      .setSubheader(`${sum(totalRuns)} in total`)
      .setDatasets(DatasetTypes.Simple('Total runs', totalRuns));
  }

  protected failedPuzzles(labels: string[], metrics: RunMetricStats[]): ILineChartSection {
    const failsCounts: number[] = metrics.map((metric: RunMetricStats) => metric.fails.total);
    return new LineChartSection('Failed puzzles', labels)
      .setSubheader(`${sum(failsCounts)} in total`)
      .setDatasets(DatasetTypes.Triple(metricSeries(metrics, 'fails')));
  }

  protected highScores(labels: string[], metrics: RunMetricStats[]): ILineChartSection {
    const highScores: number[] = metrics.map((metric: RunMetricStats) => metric.score.max);
    return new LineChartSection('High scores', labels)
      .setSubheader(`${Math.max(...highScores)} was the best score`)
      .setDatasets(DatasetTypes.Triple(metricSeries(metrics, 'score')));
  }
}
