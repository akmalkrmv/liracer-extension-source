import { Component, InputSignal, input } from '@angular/core';
import { IGroupedRace } from '../../models';
import { RacerGroupCard } from '../racer-group-card/racer-group-card';
import { IRacerFilter } from '../../models/racer-filter.model';

@Component({
  selector: 'app-racer-group',
  imports: [RacerGroupCard],
  templateUrl: 'racer-group.html',
  styles: '',
})
export class RacerGroup {
  public readonly filtered: InputSignal<IGroupedRace[]> = input.required<IGroupedRace[]>();
  public readonly filter: InputSignal<IRacerFilter> = input.required<IRacerFilter>();
}
