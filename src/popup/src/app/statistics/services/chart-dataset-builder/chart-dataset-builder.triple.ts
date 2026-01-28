import { IMetricSeries } from '../../../models';
import { CHART_COLORS } from '../../consts';
import { BaseDataset } from './chart-dataset-builder.base';
import { SecondaryDataset, SimpleDataset } from './chart-dataset-builder.simple';

const DEFAULT_COLOR_SET = {
  max: CHART_COLORS.green,
  avg: CHART_COLORS.textMuted,
  min: CHART_COLORS.red,
} as const;

export class TripleDataset extends BaseDataset {
  constructor(series: IMetricSeries, colors = DEFAULT_COLOR_SET) {
    super([
      new SecondaryDataset('Highest', series.max, colors.max),
      new SimpleDataset('Average', series.avg, colors.avg),
      new SecondaryDataset('Lowest', series.min, colors.min),
    ]);
  }
}

export class TripleReverseDataset extends BaseDataset {
  constructor(series: IMetricSeries, colors = DEFAULT_COLOR_SET) {
    super([
      new SecondaryDataset('Highest', series.min, colors.min),
      new SimpleDataset('Average', series.avg, colors.avg),
      new SecondaryDataset('Lowest', series.max, colors.max),
    ]);
  }
}
