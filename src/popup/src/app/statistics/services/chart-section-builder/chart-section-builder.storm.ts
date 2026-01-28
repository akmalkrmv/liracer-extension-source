import { IGroupedStorm, IStormGroupStats } from '../../../models';
import { ILineChartSection, LineChartSection } from '../../models';
import { DatasetTypes } from '../chart-dataset-builder';
import { metricSeries } from '../to-metric-series';
import { BaseChartSectionsBuilder } from './chart-section-builder.base';

export class StormChartSectionsBuilder extends BaseChartSectionsBuilder<IGroupedStorm> {
  public build(groups: IGroupedStorm[]): ILineChartSection[] {
    const labels: string[] = groups.map((group: IGroupedStorm) => group.label);
    const totalRuns: number[] = groups.map((group: IGroupedStorm) => group.runs.length ?? 0);
    const metrics: IStormGroupStats[] = groups.map((group: IGroupedStorm) => group.metric);

    const sections: ILineChartSection[] = [
      this.runs(labels, totalRuns),
      this.failedPuzzles(labels, metrics),
      this.highScores(labels, metrics),
      this.ratings(labels, metrics),
    ];

    return sections;
  }

  private ratings(labels: string[], metrics: IStormGroupStats[]): ILineChartSection {
    const maxRating: number[] = metrics.map((metric: IStormGroupStats) => metric.highestSolved.max);
    return new LineChartSection('Ratings of solved puzzles', labels)
      .setSubheader(`${Math.max(...maxRating)} was the highest solved`)
      .setDatasets(DatasetTypes.Triple(metricSeries(metrics, 'highestSolved')));
  }
}
