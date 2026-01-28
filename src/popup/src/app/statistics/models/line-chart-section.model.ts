import { TLineChartDataset } from './line-chart-types';

export interface ILineChartSection {
  header: string;
  subheader?: string;
  labels: string[];
  datasets: TLineChartDataset[];
}

export class LineChartSection implements ILineChartSection {
  constructor(
    public header: string = '',
    public labels: string[] = [],
    public datasets: TLineChartDataset[] = [],
    public subheader?: string,
  ) {}

  public setHeader(header: string): LineChartSection {
    this.header = header;
    return this;
  }

  public setLabels(labels: string[]): LineChartSection {
    this.labels = labels;
    return this;
  }

  public setDatasets(datasets: TLineChartDataset[]): LineChartSection {
    this.datasets = datasets;
    return this;
  }

  public setSubheader(subheader: string): LineChartSection {
    this.subheader = subheader;
    return this;
  }
}
