import { Component, input, InputSignal } from '@angular/core';
import { IGroupedStorm } from '../../models';
import { StormGroupCard } from '../storm-group-card/storm-group-card';

@Component({
  selector: 'app-storm-group',
  imports: [StormGroupCard],
  templateUrl: './storm-group.html',
  styles: ``,
})
export class StormGroup {
  public readonly filtered: InputSignal<IGroupedStorm[]> = input.required<IGroupedStorm[]>();
}
