import { DatePipe } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { GroupingStrategy } from '../../models';

const TIME = {
  MINUTE_IN_MS: 1000 * 60,
  HOUR_IN_MS: 1000 * 60 * 60,
  DAY_IN_MS: 1000 * 60 * 60 * 24,
  WEEK_IN_DAYS: 7,
  MONTH_IN_DAYS: 30,
} as const;

@Injectable({ providedIn: 'root' })
export class RelativeLabelsService {
  private readonly datePipe: DatePipe = inject(DatePipe);

  public getRelativeDateLabel(timestamp: number, groupingStrategy?: GroupingStrategy): string {
    const date = new Date(timestamp);
    const today = new Date();

    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime: number = today.getTime() - date.getTime();
    const diffDays: number = diffTime / TIME.DAY_IN_MS;
    const diffWeeks: number = Math.floor(diffDays / 7);

    if (groupingStrategy === 'static') return this.toDate(date, groupingStrategy);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${Math.floor(diffDays)} days ago`;
    if (groupingStrategy === 'date') return this.toDate(date, groupingStrategy);
    if (groupingStrategy === 'day-name') return this.toDate(date, groupingStrategy);
    if (diffDays < 30) return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;

    return date.toLocaleDateString();
  }

  public getRelativeTimeLabel(timestamp: number, fallbackFormat?: string | undefined): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs: number = now.getTime() - date.getTime();

    const diffMins: number = Math.floor(diffMs / TIME.MINUTE_IN_MS);
    const diffHours: number = Math.floor(diffMs / TIME.HOUR_IN_MS);

    const time: string = this.toTime(date);
    const dayName: string = this.toDateName(date);
    const datetime: string = this.toDateTime(date);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    if (diffHours < 24) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    if (this.isYesterday(date)) return `Yesterday at ${time}`;
    if (this.isLessThanAWeek(date)) return `${dayName} at ${time}`;

    return fallbackFormat
      ? (this.datePipe.transform(date, fallbackFormat) ?? datetime) // try date pipe
      : datetime;
  }

  private isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  private isLessThanAWeek(date: Date): boolean {
    const now = new Date();
    const diffMs: number = now.getTime() - date.getTime();
    const diffDays: number = Math.floor(diffMs / TIME.DAY_IN_MS);
    return diffDays < 7;
  }

  private toDate(date: Date, strategy: GroupingStrategy): string {
    switch (strategy) {
      case 'static':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case 'day-name':
        return date.toLocaleDateString([], { weekday: 'short' });
      case 'date':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case 'relative':
      default:
        return this.toDateName(date);
    }
  }

  private toTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private toDateName(date: Date): string {
    return date.toLocaleDateString([], { weekday: 'long' });
  }

  private toDateTime(date: Date): string {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
