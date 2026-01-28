import { ILineChartSection } from '../../models';

export interface IChartSectionsBuilder<T> {
  build(groups: T[]): ILineChartSection[];
}
