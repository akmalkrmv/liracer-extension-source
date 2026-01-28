export interface PuzzleExportOptions {
  includeStats: boolean;
  type: 'racer' | 'storm';
  selectedStats?: StatisticsSelection;
}

export interface StatisticsSelection {
  solved: StatMetricOptions;
  unsolved: StatMetricOptions;
  score: StatMetricOptions;
  reviewed?: StatMetricOptions;
  moves?: StatMetricOptions;
  accuracy?: StatMetricOptions;
  combo?: StatMetricOptions;
  time?: StatMetricOptions;
  rank?: StatMetricOptions;
  totalPlayers?: StatMetricOptions;
}

export interface StatMetricOptions {
  enabled: boolean;
  average: boolean;
  min: boolean;
  max: boolean;
}

export interface StatDefinition {
  key: keyof StatisticsSelection;
  label: string;
  stats: 'all' | 'racer' | 'storm';
}
