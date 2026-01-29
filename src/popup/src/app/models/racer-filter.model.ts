import { DateRange } from './date-range.model';
import { TGroupByFilter, TViewMode } from './run-filter.model';

export interface IRacerFilter {
  dateRange: DateRange;
  groupBy: TGroupByFilter;
  viewMode: TViewMode;
}
