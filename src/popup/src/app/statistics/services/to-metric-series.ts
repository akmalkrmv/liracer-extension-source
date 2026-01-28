import { RunMetricStats, MetricKey, IMetricSummary, IMetricSeries } from '../../models';

export function metricSeries<T extends RunMetricStats, K extends MetricKey<T>>(
  metrics: T[],
  key: K,
): IMetricSeries {
  return {
    max: metrics.map((m: T) => (m[key] as IMetricSummary).max),
    avg: metrics.map((m: T) => (m[key] as IMetricSummary).average),
    min: metrics.map((m: T) => (m[key] as IMetricSummary).min),
  };
}
