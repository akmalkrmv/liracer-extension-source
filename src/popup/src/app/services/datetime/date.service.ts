import { Injectable } from '@angular/core';
import { DateRange, DATE_RANGES } from '../../models';

@Injectable({ providedIn: 'root' })
export class DateService {
  getDateRangeFilter(range: DateRange): ((timestamp: number) => boolean) | null {
    const offset: number = DATE_RANGES[range]?.offset;
    if (offset === undefined) return null;

    // Create today at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate cutoff date at midnight
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - offset);

    return (timestamp: number) => {
      if (offset === Infinity) return true;
      const raceDate = new Date(timestamp);
      raceDate.setHours(0, 0, 0, 0);
      return raceDate >= cutoffDate;
    };
  }

  // Get the next key (wraps around)
  getNextRange(range: DateRange): DateRange {
    const keys = Object.keys(DATE_RANGES) as DateRange[];
    const index: number = keys.indexOf(range);

    // Wrap around if we're at the last key
    return keys[(index + 1) % keys.length]; // Loops back to the first key if we reach the end
  }

  // Get the previous key (wraps around)
  getPrevRange(range: DateRange): DateRange {
    const keys = Object.keys(DATE_RANGES) as DateRange[];
    const index: number = keys.indexOf(range);

    // Wrap around if we're at the first key
    return keys[(index - 1 + keys.length) % keys.length]; // Loops back to the last key if we reach the beginning
  }
}
