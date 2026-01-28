import { Component, model, ModelSignal } from '@angular/core';
import { RangeFilter } from '../../range-filter/range-filter';
import { IStormFilter } from '../../models/storm-filter.model';
import { DateRange } from '../../services/datetime/date.service';

@Component({
  selector: 'app-storm-filters',
  imports: [RangeFilter],
  templateUrl: './storm-filters.html',
  styles: ``,
})
export class StormFilters {
  public readonly filter: ModelSignal<IStormFilter> = model.required<IStormFilter>();

  updateRange(dateRange: DateRange) {
    this.filter.update((value: IStormFilter) => ({ ...value, dateRange }));
  }
}
