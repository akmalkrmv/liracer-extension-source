import { Component, computed, inject, Signal, WritableSignal } from '@angular/core';
import { RacerFilter } from './racer-filter/racer-filter';
import { RacerGroup } from './racer-group/racer-group';
import { IRace } from '@extension/shared/models';
import { IGroupedRace, DateRange, IRacerFilter } from '../models';
import { DateService } from '../services/datetime/date.service';
import { RacerService } from '../services/racer/racer.service';
import { LoadMore } from '../actions/load-more/load-more';

@Component({
  selector: 'app-racer',
  imports: [RacerFilter, RacerGroup, LoadMore],
  template: `<section>
    @if (races()) {
      <app-racer-filter [(filter)]="filter" />
      <app-racer-group [filtered]="filtered()" [filter]="filter()" />
      <app-load-more [canLoadMore]="canLoadMore()" (clicked)="loadMore()" />
    } @else {
      <div class="card">No racer runs yet.</div>
    }
  </section>`,
  styles: ``,
})
export class RacerSection {
  private readonly dateService: DateService = inject(DateService);
  private readonly service: RacerService = inject(RacerService);

  // State
  public readonly races: Signal<IRace[]> = this.service.races;
  public readonly groups: Signal<IGroupedRace[]> = this.service.groups;
  public readonly filter: WritableSignal<IRacerFilter> = this.service.filter;
  public readonly filtered: Signal<IGroupedRace[]> = computed(() => this.filterGroups());
  public readonly canLoadMore: Signal<boolean> = computed(
    () => this.filtered().length < this.groups().length,
  );

  filterGroups() {
    const groups: IGroupedRace[] = this.groups();

    // filter by date range
    const range: DateRange = this.filter().dateRange;
    const rangeFilter: Function | null = this.dateService.getDateRangeFilter(range);
    if (rangeFilter) return groups.filter((group: IGroupedRace) => rangeFilter(group.timestamp));

    return groups;
  }

  loadMore() {
    if (this.canLoadMore()) {
      const dateRange: DateRange = this.dateService.getNextRange(this.filter().dateRange);
      this.filter.update((filter: IRacerFilter) => ({ ...filter, dateRange }));
    }
  }
}
