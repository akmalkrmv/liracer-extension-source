import { RelativeLabelsService } from '../datetime/relative-labels.service';
import { IGroupingStrategy } from './grouping-strategy.interface';

export class StaticTimeGroupingStrategy implements IGroupingStrategy {
  constructor(private relativeLabels: RelativeLabelsService) {}

  getGroupingKey(timestamp: number): string {
    return this.relativeLabels.getRelativeDateLabel(timestamp, 'date');
  }
}
