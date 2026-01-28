import { DatePipe } from '@angular/common';
import { IRunBase } from '../../../../models';
import { StatisticsSelection, StatMetricOptions } from '../../models';
import { IStatsExportGenerator } from './stats-export-generator.interface';
import { DIVIDER, NEW_LINE } from '../../consts';

type TRacerStatsDateRange = { start: string | null; end: string | null };
type TRacerStatsValues = { average: number; min: number; max: number };

export abstract class BaseStatsExportGenerator<
  T extends IRunBase,
> implements IStatsExportGenerator<T> {
  private readonly datePipe: DatePipe = new DatePipe('en-US');

  public generate(runs: T[], selection?: StatisticsSelection): string {
    let content: string[] = ['STATISTICS', DIVIDER];

    content.push(this.dateRange(runs));
    content.push(this.totalRuns(runs) + NEW_LINE);
    content.push(this.stats(runs, selection) + NEW_LINE);

    return content.filter(Boolean).join(NEW_LINE);
  }

  protected totalRuns(runs: T[]): string {
    return `Total Runs: ${runs.length}`;
  }

  protected dateRange(runs: T[]): string {
    const { start, end }: TRacerStatsDateRange = this.getDateRange(runs);
    return start && end ? `Date Range: ${start} to ${end}` : '';
  }

  protected abstract stats(runs: T[], selection?: StatisticsSelection): string;

  protected formatStatMetric(
    label: string,
    metric: TRacerStatsValues,
    options: StatMetricOptions,
    unit: string = '',
  ): string {
    const content: string[] = [];

    if (options.max) {
      content.push(`${label} max: ${metric.max}${unit}`);
    }

    if (options.average) {
      content.push(`${label} avg: ${metric.average.toFixed(2)}${unit}`);
    }

    if (options.min) {
      content.push(`${label} min: ${metric.min}${unit}`);
    }

    return content.join(NEW_LINE);
  }

  protected getDateRange(runs: T[]): TRacerStatsDateRange {
    if (!runs.length) {
      return { start: null, end: null };
    }

    const timestamps: number[] = runs
      .map((run: T): number => run.timestamp)
      .sort((a: number, b: number): number => a - b);

    const format = 'MMM d, yyyy';
    const startDate = new Date(timestamps[0]);
    const endDate = new Date(timestamps[timestamps.length - 1]);

    return {
      start: this.datePipe.transform(startDate, format),
      end: this.datePipe.transform(endDate, format),
    };
  }
}
