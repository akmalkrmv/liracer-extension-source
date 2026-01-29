export const DATE_RANGES = {
  today: { key: 'today', label: 'Today', offset: 0 },
  yesterday: { key: 'yesterday', label: 'Yesterday', offset: 1 },
  week: { key: 'week', label: 'Last 7 days', offset: 7 },
  month: { key: 'month', label: 'Last 30 days', offset: 30 },
  all: { key: 'all', label: 'All time', offset: Infinity },
} as const;

export type DateRange = keyof typeof DATE_RANGES;
export type DateRangeValue = (typeof DATE_RANGES)[DateRange];
