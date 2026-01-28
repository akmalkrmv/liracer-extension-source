import { Component, input, InputSignal } from '@angular/core';
import { IStorm } from '@extension/shared/models';
import { LINKS } from '@extension/shared/consts';
import { PuzzleLinks } from '../../puzzle-links/puzzle-links';

@Component({
  selector: 'app-storm-card-content',
  imports: [PuzzleLinks],
  templateUrl: './storm-card-content.html',
  styles: ``,
})
export class StormCardContent {
  public readonly value: InputSignal<IStorm> = input.required<IStorm>();
  public readonly trainingLinkPrefix: string = LINKS.TRAINING;
}
