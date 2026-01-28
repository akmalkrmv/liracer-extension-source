import { Component, input, InputSignal } from '@angular/core';
import { StormGroupCardHeader } from '../storm-group-card-header/storm-group-card-header';
import { StormCard } from '../storm-card/storm-card';
import { IGroupedStorm } from '../../models/grouped-storm.model';

@Component({
  selector: 'app-storm-group-card',
  imports: [StormGroupCardHeader, StormCard],
  templateUrl: './storm-group-card.html',
  styles: ``,
})
export class StormGroupCard {
  public readonly value: InputSignal<IGroupedStorm> = input.required<IGroupedStorm>();
}
