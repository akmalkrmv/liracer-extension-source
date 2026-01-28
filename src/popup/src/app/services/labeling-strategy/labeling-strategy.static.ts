import { RelativeLabelsService } from '../datetime/relative-labels.service';
import { ILabelingStrategy } from './labeling-strategy.interface';

export class StaticTimeLabelingStrategy implements ILabelingStrategy {
  constructor(private relativeLabels: RelativeLabelsService) {}

  getTimeLabel(timestamp: number): string {
    return this.relativeLabels.getRelativeDateLabel(timestamp, 'static');
  }
}
