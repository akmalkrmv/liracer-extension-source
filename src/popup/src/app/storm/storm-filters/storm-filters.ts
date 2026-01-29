import { Component, model, ModelSignal } from '@angular/core';
import { RangeFilter } from '../../range-filter/range-filter';
import { IStormFilter } from '../../models/storm-filter.model';
import { ButtonGroupComponent, ButtonOption } from '../../components/button-group/button-group';
import { DateRange, TGroupByFilter, TViewMode } from '../../models';

@Component({
  selector: 'app-storm-filters',
  imports: [RangeFilter, ButtonGroupComponent],
  template: `
    @if (filter(); as filter) {
      <app-range-filter
        [compact]="true"
        [value]="filter.dateRange"
        (valueChange)="updateRange($event)"
      />
      <div class="flex-row space-between">
        <app-button-group
          [options]="groupByOptions"
          [selectedValue]="filter.groupBy"
          (valueChanged)="updateGroupBy($event)"
        />
        <app-button-group
          [options]="viewModeOptions"
          [selectedValue]="filter.viewMode"
          (valueChanged)="updateViewMode($event)"
        />
      </div>
    }
  `,
  styles: ``,
})
export class StormFilters {
  public readonly filter: ModelSignal<IStormFilter> = model.required<IStormFilter>();

  protected readonly groupByOptions: ButtonOption<TGroupByFilter>[] = [
    { value: 'relative', label: 'Relative', icon: 'label' },
    { value: 'date', label: 'Days', icon: 'calendar_month' },
  ];
  protected readonly viewModeOptions: ButtonOption<TViewMode>[] = [
    { value: 'grouped', label: 'Grouped', icon: 'view_agenda' },
    { value: 'all', label: 'Combined', icon: 'view_list' },
  ];

  protected updateRange(dateRange: DateRange) {
    this.filter.update((value: IStormFilter) => ({ ...value, dateRange }));
  }

  protected updateGroupBy(groupBy: TGroupByFilter) {
    this.filter.update((value: IStormFilter) => ({ ...value, groupBy }));
  }

  protected updateViewMode(viewMode: TViewMode) {
    this.filter.update((value: IStormFilter) => ({ ...value, viewMode }));
  }
}
