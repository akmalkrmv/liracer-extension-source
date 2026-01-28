import { Component, model, ModelSignal } from '@angular/core';
import { DateRange } from '../../services/datetime/date.service';
import { RangeFilter } from '../../range-filter/range-filter';
import { IRacerFilter, TGroupByFilter, TViewMode } from '../../models/racer-filter.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-racer-filter',
  imports: [RangeFilter, MatIconModule],
  template: `
    <app-range-filter [value]="filter().dateRange" (valueChange)="updateRange($event)" />
    <div class="flex-row space-between">
      <div class="button-group">
        <button
          class="btn btn-sm"
          (click)="updateGroupBy('relative')"
          [class.active]="filter().groupBy === 'relative'"
        >
          Relative
        </button>
        <button
          class="btn btn-sm"
          (click)="updateGroupBy('date')"
          [class.active]="filter().groupBy === 'date'"
        >
          Days
        </button>
      </div>

      <div class="button-group">
        <button
          class="btn btn-sm"
          (click)="updateViewMode('grouped')"
          [class.active]="filter().viewMode === 'grouped'"
        >
          <mat-icon>view_agenda</mat-icon>
          Grouped
        </button>
        <button
          class="btn btn-sm"
          (click)="updateViewMode('all')"
          [class.active]="filter().viewMode === 'all'"
        >
          <mat-icon>view_list</mat-icon>
          Combined
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class RacerFilter {
  public readonly filter: ModelSignal<IRacerFilter> = model.required<IRacerFilter>();

  public updateRange(dateRange: DateRange) {
    this.filter.update((value: IRacerFilter) => ({ ...value, dateRange }));
  }

  public updateGroupBy(groupBy: TGroupByFilter) {
    this.filter.update((value: IRacerFilter) => ({ ...value, groupBy }));
  }

  public updateViewMode(viewMode: TViewMode) {
    this.filter.update((value: IRacerFilter) => ({ ...value, viewMode }));
  }
}
