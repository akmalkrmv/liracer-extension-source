import { DateRange } from './date-range.model';

export type TViewMode = 'all' | 'grouped' | undefined;
export type TGroupByFilter = 'relative' | 'date' | 'day-name' | undefined;

export interface IRunFilter {
  dateRange: DateRange;
  groupBy: TGroupByFilter;
  viewMode: TViewMode;
}
