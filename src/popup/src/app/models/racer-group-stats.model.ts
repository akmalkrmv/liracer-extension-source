import { IMetricSummary, MetricSummary } from './metric-summary.model';

export interface IRaceGroupStats {
  // puzzles
  solved: IMetricSummary;
  unsolved: IMetricSummary;
  reviewed: IMetricSummary;
  fails: IMetricSummary;

  // stats
  score: IMetricSummary;
  rank: IMetricSummary;
  totalPlayers: IMetricSummary;
}

export class RaceGroupStats implements IRaceGroupStats {
  constructor(
    // puzzles
    public solved: IMetricSummary = new MetricSummary(),
    public unsolved: IMetricSummary = new MetricSummary(),
    public reviewed: IMetricSummary = new MetricSummary(),
    public fails: IMetricSummary = new MetricSummary(),

    // stats
    public score: IMetricSummary = new MetricSummary(),
    public rank: IMetricSummary = new MetricSummary(),
    public totalPlayers: IMetricSummary = new MetricSummary(),
  ) {}
}
