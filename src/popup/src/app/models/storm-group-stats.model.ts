import { IMetricSummary, MetricSummary } from './metric-summary.model';

export interface IStormGroupStats {
  // puzzles
  solved: IMetricSummary;
  unsolved: IMetricSummary;
  reviewed: IMetricSummary;
  fails: IMetricSummary;

  // stats
  score: IMetricSummary;
  moves: IMetricSummary;
  accuracy: IMetricSummary;
  combo: IMetricSummary;
  time: IMetricSummary;
  timePerMove: IMetricSummary;
  highestSolved: IMetricSummary;
}

export class StormGroupStats implements IStormGroupStats {
  constructor(
    // puzzles
    public solved: IMetricSummary = new MetricSummary(),
    public unsolved: IMetricSummary = new MetricSummary(),
    public reviewed: IMetricSummary = new MetricSummary(),
    public fails: IMetricSummary = new MetricSummary(),

    // stats
    public score: IMetricSummary = new MetricSummary(),
    public moves: IMetricSummary = new MetricSummary(),
    public accuracy: IMetricSummary = new MetricSummary(),
    public combo: IMetricSummary = new MetricSummary(),
    public time: IMetricSummary = new MetricSummary(),
    public timePerMove: IMetricSummary = new MetricSummary(),
    public highestSolved: IMetricSummary = new MetricSummary(),
  ) {}
}
