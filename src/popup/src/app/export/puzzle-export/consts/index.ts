import { StatMetricOptions, StatisticsSelection, StatDefinition } from '../models';

export const NEW_LINE = '\n';
export const DIVIDER = '==================================';

export const DEFAULT_STAT_METRIC: StatMetricOptions = {
  enabled: true,
  average: true,
  min: false,
  max: false,
};

export const DEFAULT_RACER_STATS: StatisticsSelection = {
  solved: { ...DEFAULT_STAT_METRIC },
  unsolved: { ...DEFAULT_STAT_METRIC },
  reviewed: { ...DEFAULT_STAT_METRIC },
  score: { ...DEFAULT_STAT_METRIC, max: true },
  rank: { ...DEFAULT_STAT_METRIC, enabled: false },
  totalPlayers: { ...DEFAULT_STAT_METRIC, enabled: false },
};

export const DEFAULT_STORM_STATS: StatisticsSelection = {
  solved: { ...DEFAULT_STAT_METRIC },
  unsolved: { ...DEFAULT_STAT_METRIC },
  reviewed: { ...DEFAULT_STAT_METRIC },
  score: { ...DEFAULT_STAT_METRIC, max: true },
  moves: { ...DEFAULT_STAT_METRIC, enabled: false },
  accuracy: { ...DEFAULT_STAT_METRIC, enabled: false },
  combo: { ...DEFAULT_STAT_METRIC, enabled: false },
  time: { ...DEFAULT_STAT_METRIC, enabled: false },
};

export const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'solved', label: 'Solved', stats: 'all' },
  { key: 'unsolved', label: 'Unsolved', stats: 'all' },
  { key: 'reviewed', label: 'Reviewed', stats: 'all' },
  { key: 'score', label: 'Score', stats: 'all' },
  { key: 'rank', label: 'Rank', stats: 'racer' },
  { key: 'totalPlayers', label: 'Total Players', stats: 'racer' },
  { key: 'moves', label: 'Moves', stats: 'storm' },
  { key: 'accuracy', label: 'Accuracy', stats: 'storm' },
  { key: 'combo', label: 'Combo', stats: 'storm' },
  { key: 'time', label: 'Time', stats: 'storm' },
];
