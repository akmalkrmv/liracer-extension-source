import { Injectable, inject } from '@angular/core';
import {
  IRunBase,
  IGroupingConfig,
  DEFAULT_CONFIG,
  IRunGroupBase,
  RunMetricStats,
} from '../models';
import { ILabelingStrategy, LabelingStrategyFactory } from './labeling-strategy';
import { GroupingStrategyFactory, IGroupingStrategy } from './grouping-strategy';
import { IRunStatCalculator } from './stats-calculator';

@Injectable({ providedIn: 'root' })
export class RunGroupingService<T extends IRunBase> {
  private readonly labelingFactory: LabelingStrategyFactory = inject(LabelingStrategyFactory);
  private readonly groupingFactory: GroupingStrategyFactory = inject(GroupingStrategyFactory);

  public groupRunsByDate(
    runs: Array<T>,
    calculator: IRunStatCalculator<T>,
    config: IGroupingConfig = DEFAULT_CONFIG,
  ): IRunGroupBase<T>[] {
    const grouping: IGroupingStrategy = this.groupingFactory.getGroupingStrategy(config.strategy);
    const labeling: ILabelingStrategy = this.labelingFactory.getLabelingStrategy(config.labeling);

    const groups: IRunGroupBase<T>[] = this.groupRuns(runs, grouping, labeling);
    const sorted: IRunGroupBase<T>[] = this.sortGroups(groups, config.sortDescending);
    const enriched: IRunGroupBase<T>[] = this.enrichGroups(sorted, calculator);

    return enriched;
  }

  private groupRuns(
    runs: Array<T>,
    grouping: IGroupingStrategy,
    labeling: ILabelingStrategy,
  ): IRunGroupBase<T>[] {
    const groupMap = new Map<string, IRunGroupBase<T>>();

    for (const run of runs) {
      const date: Date = this.startOfDay(new Date(run.timestamp));
      const time: number = date.getTime();
      const key: string = grouping.getGroupingKey(time);
      const label: string = labeling.getTimeLabel(time);

      const existingGroup: IRunGroupBase<T> | undefined = groupMap.get(key);

      if (existingGroup) {
        existingGroup.runs.push(run);
      } else {
        groupMap.set(key, this.createEmptyGroup(time, label));
      }
    }

    return Array.from(groupMap.values());
  }

  private enrichGroups(
    groups: IRunGroupBase<T>[],
    calculator: IRunStatCalculator<T>,
  ): IRunGroupBase<T>[] {
    return groups.map((group: IRunGroupBase<T>) => {
      const runs: T[] = this.sortRuns(group.runs);
      const metric: RunMetricStats = calculator.calculateMetricStats(runs);
      return { ...group, runs, metric };
    });
  }

  private sortGroups(groups: IRunGroupBase<T>[], descending: boolean = true): IRunGroupBase<T>[] {
    return descending
      ? [...groups].sort((a: IRunGroupBase<T>, b: IRunGroupBase<T>) => b.timestamp - a.timestamp) // sort by recent
      : [...groups].sort((a: IRunGroupBase<T>, b: IRunGroupBase<T>) => a.timestamp - b.timestamp);
  }

  private sortRuns(runs: T[]): T[] {
    return [...runs].sort((a: T, b: T) => b.timestamp - a.timestamp);
  }

  private startOfDay(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  private createEmptyGroup(timestamp: number, label: string): IRunGroupBase<T> {
    return { timestamp, label, runs: [] };
  }
}
