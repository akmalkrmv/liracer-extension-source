import { inject, Injectable } from '@angular/core';
import { RelativeLabelsService } from '../datetime/relative-labels.service';
import { ILabelingStrategy } from './labeling-strategy.interface';
import { RelativeTimeLabelingStrategy } from './labeling-strategy.relative';
import { StaticTimeLabelingStrategy } from './labeling-strategy.static';
import { GroupingStrategy } from '../../models';

@Injectable({ providedIn: 'root' })
export class LabelingStrategyFactory {
  private readonly relativeLabels: RelativeLabelsService = inject(RelativeLabelsService);

  public getLabelingStrategy(type: GroupingStrategy): ILabelingStrategy {
    switch (type) {
      case 'date':
        return new StaticTimeLabelingStrategy(this.relativeLabels);

      case 'relative':
      default:
        return new RelativeTimeLabelingStrategy(this.relativeLabels);
    }
  }
}
