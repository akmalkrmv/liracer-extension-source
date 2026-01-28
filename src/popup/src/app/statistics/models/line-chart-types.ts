import { ChartDataset, ChartOptions } from 'chart.js';

export type TLineChartDataset = ChartDataset<'line', number[]>;
export type TLineChartScalesOptions = ChartOptions<'line'>['scales'];
