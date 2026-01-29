import { Component, computed, inject, Signal, WritableSignal } from '@angular/core';
import { StormFilters } from './storm-filters/storm-filters';
import { IStorm } from '@extension/shared/models';
import { StormService } from '../services/storm/storm.service';
import { IGroupedStorm } from '../models/grouped-storm.model';
import { DateService } from '../services/datetime/date.service';
import { IStormFilter } from '../models/storm-filter.model';
import { LoadMore } from '../actions/load-more/load-more';
import { StormGroup } from './storm-group/storm-group';
import { DateRange } from '../models';

@Component({
  selector: 'app-storm',
  imports: [StormFilters, LoadMore, StormGroup],
  template: `<section>
    @if (storms()) {
      <app-storm-filters [(filter)]="filter" />
      <app-storm-group [filtered]="filtered()" [filter]="filter()" />
      <app-load-more [canLoadMore]="canLoadMore()" (clicked)="loadMore()" />
    } @else {
      <div class="card">No storm runs yet.</div>
    }
  </section> `,
  styles: ``,
})
export class StormSection {
  private readonly dateService: DateService = inject(DateService);
  private readonly service: StormService = inject(StormService);

  // State signals
  storms: Signal<IStorm[]> = this.service.storms;
  groups: Signal<IGroupedStorm[]> = this.service.groups;
  filter: WritableSignal<IStormFilter> = this.service.filter;
  filtered: Signal<IGroupedStorm[]> = computed(() => this.filterGroups());
  canLoadMore: Signal<boolean> = computed(() => this.filtered().length < this.groups().length);

  filterGroups() {
    const groups: IGroupedStorm[] = this.groups();

    // Filter by date range
    const range: DateRange = this.filter().dateRange;
    const rangeFilter: Function | null = this.dateService.getDateRangeFilter(range);
    if (rangeFilter) return groups.filter((group: IGroupedStorm) => rangeFilter(group.timestamp));

    return groups;
  }

  loadMore() {
    if (this.canLoadMore()) {
      const dateRange: DateRange = this.dateService.getNextRange(this.filter().dateRange);
      this.filter.update((filter: IStormFilter) => ({ ...filter, dateRange }));
    }
  }
}
