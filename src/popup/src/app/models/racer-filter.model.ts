import { DateRange } from '../services/datetime/date.service';

export type TViewMode = 'all' | 'grouped' | undefined;
export type TGroupByFilter = 'relative' | 'date' | 'day-name' | undefined;

export interface IRacerFilter {
  dateRange: DateRange;
  groupBy: TGroupByFilter;
  viewMode: TViewMode;
}
