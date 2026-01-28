import { inject, Pipe, PipeTransform } from '@angular/core';
import { RelativeLabelsService } from '../services/datetime/relative-labels.service';

@Pipe({ name: 'relativeDate' })
export class RelativeDatePipe implements PipeTransform {
  private readonly relativeLabels: RelativeLabelsService = inject(RelativeLabelsService);

  transform(value: number, fallbackFormat?: string | undefined): unknown {
    return this.relativeLabels.getRelativeTimeLabel(value, fallbackFormat);
  }
}
