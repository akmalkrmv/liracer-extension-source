import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { IStatisticTab, StatisticsService } from './services/statistics.service';
import { LineChart } from './line-chart';

@Component({
  selector: 'app-statistics',
  imports: [LineChart],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics implements OnInit {
  private readonly service: StatisticsService = inject(StatisticsService);

  protected readonly tabs: WritableSignal<IStatisticTab[]> = this.service.tabs;
  protected readonly selected: WritableSignal<IStatisticTab | undefined> = this.service.selectedTab;

  async ngOnInit(): Promise<void> {
    await this.service.initialize();
  }
}
