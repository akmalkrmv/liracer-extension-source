import { CHART_COLORS } from '../../consts';
import { BaseDataset } from './chart-dataset-builder.base';
import { createDataset } from './chart-dataset-builder.utils';

export class SimpleDataset extends BaseDataset {
  constructor(label: string, data: number[], color: string = CHART_COLORS.textMuted) {
    super([createDataset(label, data, color)]);
  }
}

export class SecondaryDataset extends BaseDataset {
  constructor(label: string, data: number[], color: string = CHART_COLORS.textMuted) {
    super([createDataset(label, data, color, true)]);
  }
}
