import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { IRace, IStorm } from '@extension/shared/models';
import { ILineChartSection } from '../models';
import { IGroupedRace, IGroupedStorm, IGroupingConfig } from '../../models';
import { RacerService } from '../../services/racer';
import { StormService } from '../../services/storm';
import { RunGroupingService } from '../../services/run-grouping.service';
import { RacerStatsCalculator, StormStatCalculator } from '../../services/stats-calculator';
import { RacerChartSectionsBuilder, StormChartSectionsBuilder } from './chart-section-builder/';

export interface IStatisticTab {
  title: string;
  header: string;
  sections: ILineChartSection[];
}

const config: IGroupingConfig = {
  strategy: 'date',
  labeling: 'date',
  sortDescending: false,
};

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private readonly racerService: RacerService = inject(RacerService);
  private readonly stormService: StormService = inject(StormService);
  private readonly grouping: RunGroupingService<any> = inject(RunGroupingService);

  public readonly tabs: WritableSignal<IStatisticTab[]> = signal([]);
  public readonly selectedTab: WritableSignal<IStatisticTab | undefined> = signal(undefined);

  public async initialize(): Promise<void> {
    const tabs: IStatisticTab[] = [
      { title: 'Racer', header: 'Racer stats', sections: await this.getRacerStatisticsForChart() },
      { title: 'Storm', header: 'Storm stats', sections: await this.getStormStatisticsForChart() },
    ];

    this.tabs.set(tabs);
    this.selectedTab.set(tabs[0]);
  }

  // last 30 days graphic charts of high score, total runs, and avg.failed/runs if possible
  public async getRacerStatisticsForChart(): Promise<ILineChartSection[]> {
    const runs: IRace[] = await this.racerService.getAllRacerRuns();
    const calculator = new RacerStatsCalculator();
    const groups = this.grouping.groupRunsByDate(runs, calculator, config) as IGroupedRace[];
    const chartSectionsBuilder = new RacerChartSectionsBuilder();

    return chartSectionsBuilder.build(groups);
  }

  // last 30 days graphic charts of high score, total runs, and avg.failed/runs if possible
  public async getStormStatisticsForChart(): Promise<ILineChartSection[]> {
    const runs: IStorm[] = await this.stormService.getAllStormRuns();
    const calculator = new StormStatCalculator();
    const groups = this.grouping.groupRunsByDate(runs, calculator, config) as IGroupedStorm[];
    const chartSectionsBuilder = new StormChartSectionsBuilder();

    return chartSectionsBuilder.build(groups);
  }
}
