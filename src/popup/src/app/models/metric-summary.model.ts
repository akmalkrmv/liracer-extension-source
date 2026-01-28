import { average, sum } from '../services/utils';

export type MetricKey<T> = {
  [K in keyof T]: T[K] extends IMetricSummary ? K : never;
}[keyof T];

export interface IMetricSummary {
  readonly total: number;
  readonly max: number;
  readonly min: number;
  readonly average: number;
  readonly nonZeroAverage: number;
}

export class MetricSummary implements IMetricSummary {
  public readonly total: number = 0;
  public readonly max: number = 0;
  public readonly min: number = 0;
  public readonly average: number = 0;
  public readonly nonZeroAverage: number = 0;

  constructor(values?: number[]) {
    if (values) {
      const nonZeroValues: number[] = values.filter((val: number) => val > 0);
      const nonZeroValuesTotal: number = sum(nonZeroValues);

      if (nonZeroValues.length === 0) {
        return;
      }

      this.total = sum(values);
      this.max = Math.max(...nonZeroValues);
      this.min = Math.min(...nonZeroValues);
      this.average = average(this.total, values);
      this.nonZeroAverage = average(nonZeroValuesTotal, nonZeroValues);
    }
  }
}
