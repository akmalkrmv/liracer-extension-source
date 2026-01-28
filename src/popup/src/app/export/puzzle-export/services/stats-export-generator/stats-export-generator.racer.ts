import { IRace } from '@extension/shared/models';
import { IRaceGroupStats } from '../../../../models';
import { RacerStatsCalculator } from '../../../../services/stats-calculator';
import { DEFAULT_RACER_STATS, STAT_DEFINITIONS, NEW_LINE } from '../../consts';
import { StatisticsSelection, StatDefinition, StatMetricOptions } from '../../models';
import { BaseStatsExportGenerator } from './stats-export-generator.base';

type TRacerStatsSelection = Omit<StatisticsSelection, 'moves' | 'accuracy' | 'combo' | 'time'>;
type TRacerStatsValues = { average: number; min: number; max: number };
type TRacerStatsMap = Record<keyof TRacerStatsSelection, TRacerStatsValues>;

export class RacerStatsExportGenerator extends BaseStatsExportGenerator<IRace> {
  private readonly racerCalculator: RacerStatsCalculator = new RacerStatsCalculator();

  protected stats(runs: IRace[], selection?: StatisticsSelection): string {
    const stats: IRaceGroupStats = this.racerCalculator.calculateMetricStats(runs);
    const statSelection: StatisticsSelection = selection || DEFAULT_RACER_STATS;

    const racerStatsMap: TRacerStatsMap = {
      solved: stats.solved,
      unsolved: stats.unsolved,
      reviewed: stats.reviewed,
      score: stats.score,
      rank: stats.rank,
      totalPlayers: stats.totalPlayers,
    };

    const definitions: StatDefinition[] = STAT_DEFINITIONS.filter(
      ({ stats }: StatDefinition) => stats === 'all' || stats === 'racer',
    ).filter(({ key }: StatDefinition) => Boolean(statSelection[key]?.enabled));

    const metrics: string[] = definitions.map(({ key, label }: StatDefinition) => {
      const option: StatMetricOptions = statSelection[key] as StatMetricOptions;
      const metric: TRacerStatsValues = racerStatsMap[key as keyof typeof racerStatsMap];
      return this.formatStatMetric(label, metric, option);
    });

    return metrics.join(NEW_LINE);
  }
}
