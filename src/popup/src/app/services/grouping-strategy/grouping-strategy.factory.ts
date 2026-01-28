import { Injectable, inject } from '@angular/core';
import { RelativeLabelsService } from '../datetime/relative-labels.service';
import { IGroupingStrategy } from './grouping-strategy.interface';
import { RelativeTimeGroupingStrategy } from './grouping-strategy.relative';
import { StaticTimeGroupingStrategy } from './grouping-strategy.static';
import { GroupingStrategy } from '../../models';

@Injectable({ providedIn: 'root' })
export class GroupingStrategyFactory {
  private readonly relativeLabels: RelativeLabelsService = inject(RelativeLabelsService);

  public getGroupingStrategy(type: GroupingStrategy): IGroupingStrategy {
    switch (type) {
      case 'date':
        return new StaticTimeGroupingStrategy(this.relativeLabels);

      case 'relative':
      default:
        return new RelativeTimeGroupingStrategy(this.relativeLabels);
    }
  }
}
