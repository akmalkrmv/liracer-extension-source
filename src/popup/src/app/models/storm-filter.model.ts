import { DateRange } from './date-range.model';
import { TGroupByFilter, TViewMode } from './run-filter.model';

export interface IStormFilter {
  dateRange: DateRange;
  groupBy: TGroupByFilter;
  viewMode: TViewMode;
}
