import { TLineChartDataset } from '../../models';
import { ILineChartSectionDataset } from './chart-dataset-builder.interface';

export abstract class BaseDataset implements ILineChartSectionDataset {
  constructor(protected value: TLineChartDataset[] | ILineChartSectionDataset[]) {}

  public build(): TLineChartDataset[] {
    return this.value.flatMap((value: TLineChartDataset | ILineChartSectionDataset) =>
      this.normalize(value),
    );
  }

  private normalize(item: TLineChartDataset | ILineChartSectionDataset): TLineChartDataset[] {
    return this.isSectionDataset(item) ? item.build() : [item];
  }

  private isSectionDataset(value: unknown): value is ILineChartSectionDataset {
    return typeof value === 'object' && value !== null && 'value' in value;
  }
}
