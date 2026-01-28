import { IStorm } from '@extension/shared/models';
import { IStormGroupStats } from '../../../../models';
import { StormStatCalculator } from '../../../../services/stats-calculator';
import { DEFAULT_RACER_STATS, STAT_DEFINITIONS, NEW_LINE } from '../../consts';
import { StatisticsSelection, StatDefinition, StatMetricOptions } from '../../models';
import { BaseStatsExportGenerator } from './stats-export-generator.base';

type TStormStatsSelection = Omit<StatisticsSelection, 'rank' | 'totalPlayers'>;
type TStormStatsValues = { average: number; min: number; max: number };
type TStormStatsMap = Record<keyof TStormStatsSelection, TStormStatsValues>;

export class StormStatsExportGenerator extends BaseStatsExportGenerator<IStorm> {
  private readonly stormCalculator: StormStatCalculator = new StormStatCalculator();

  protected stats(runs: IStorm[], selection?: StatisticsSelection): string {
    const stats: IStormGroupStats = this.stormCalculator.calculateMetricStats(runs);
    const statSelection: StatisticsSelection = selection || DEFAULT_RACER_STATS;

    const stormStatsMap: TStormStatsMap = {
      solved: stats.solved,
      unsolved: stats.unsolved,
      reviewed: stats.reviewed,
      score: stats.score,
      moves: stats.moves,
      accuracy: stats.accuracy,
      combo: stats.combo,
      time: stats.time,
    };

    const definitions: StatDefinition[] = STAT_DEFINITIONS.filter(
      ({ stats }: StatDefinition) => stats === 'all' || stats === 'storm',
    ).filter(({ key }: StatDefinition) => Boolean(statSelection[key]?.enabled));

    const metrics: string[] = definitions.map(({ key, label }: StatDefinition) => {
      const option: StatMetricOptions = statSelection[key] as StatMetricOptions;
      const metric: TStormStatsValues = stormStatsMap[key as keyof typeof stormStatsMap];
      return this.formatStatMetric(label, metric, option);
    });

    return metrics.join(NEW_LINE);
  }
}
