import { Component, input, InputSignal, model, ModelSignal } from '@angular/core';
import { DateRange, DATE_RANGES, DateRangeValue } from '../services/datetime/date.service';

@Component({
  selector: 'app-range-filter',
  imports: [],
  template: `
    <div class="range-filter" [class.compact]="compact()">
      @for (range of dateRangeValues; track range; let index = $index) {
        <button
          class="btn btn-sm"
          [class.active]="value() === range.key"
          (click)="selectRange(index)"
        >
          {{ range.label }}
        </button>
      }
    </div>
  `,
  styleUrls: ['./range-filter.css'],
})
export class RangeFilter {
  public readonly value: ModelSignal<DateRange> = model.required<DateRange>();
  public readonly compact: InputSignal<boolean> = input<boolean>(false);

  public readonly dateRangeKeys: DateRange[] = Object.keys(DATE_RANGES) as DateRange[];
  public readonly dateRangeValues: DateRangeValue[] = Object.values(DATE_RANGES);

  selectRange(index: number) {
    this.value.set(this.dateRangeKeys[index]);
  }
}
