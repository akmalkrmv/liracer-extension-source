import { IRunBase } from '../../../../models';
import { StatisticsSelection } from '../../models';

export interface IStatsExportGenerator<T extends IRunBase> {
  generate(runs: T[], selection?: StatisticsSelection): string;
}
