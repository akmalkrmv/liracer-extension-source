import { IGroupedRace, IRaceGroupStats } from '../../../models';
import { ILineChartSection, LineChartSection } from '../../models';
import { DatasetTypes } from '../chart-dataset-builder';
import { metricSeries } from '../to-metric-series';
import { BaseChartSectionsBuilder } from './chart-section-builder.base';

export class RacerChartSectionsBuilder extends BaseChartSectionsBuilder<IGroupedRace> {
  public build(groups: IGroupedRace[]): ILineChartSection[] {
    const labels: string[] = groups.map((group: IGroupedRace) => group.label);
    const totalRuns: number[] = groups.map((group: IGroupedRace) => group.runs.length ?? 0);
    const metrics: IRaceGroupStats[] = groups.map((group: IGroupedRace) => group.metric);

    const sections: ILineChartSection[] = [
      this.runs(labels, totalRuns),
      this.failedPuzzles(labels, metrics),
      this.highScores(labels, metrics),
      this.ranks(labels, metrics),
    ];

    return sections;
  }

  private ranks(labels: string[], metrics: IRaceGroupStats[]): ILineChartSection {
    return new LineChartSection('Ranks', labels).setDatasets(
      DatasetTypes.TripleReverse(metricSeries(metrics, 'rank')),
    );
  }
}
