import { Component, input, InputSignal } from '@angular/core';
import { StormGroupCardHeader } from '../storm-group-card-header/storm-group-card-header';
import { StormCard } from '../storm-card/storm-card';
import { IGroupedStorm } from '../../models/grouped-storm.model';
import { IStormFilter } from '../../models';
import { IStorm, PuzzleId, Storm } from '@extension/shared/models';

@Component({
  selector: 'app-storm-group-card',
  imports: [StormGroupCardHeader, StormCard],
  templateUrl: './storm-group-card.html',
  styles: ``,
})
export class StormGroupCard {
  public readonly value: InputSignal<IGroupedStorm> = input.required<IGroupedStorm>();
  public readonly filter: InputSignal<IStormFilter> = input.required<IStormFilter>();

  protected combine(group: IGroupedStorm): IStorm {
    const uniqueKey: string = String(group.timestamp);
    const combined = new Storm(uniqueKey);

    let solved: PuzzleId[] = [];
    let unsolved: PuzzleId[] = [];
    let reviewed: PuzzleId[] = [];

    group.runs.forEach((run: IStorm) => {
      solved = [...new Set([...solved, ...run.solved])]; // Combine and remove duplicates
      unsolved = [...new Set([...unsolved, ...run.unsolved])];
      reviewed = [...new Set([...reviewed, ...run.reviewed])];
    });

    // Set puzzles
    combined.setPuzzles({ solved, unsolved, reviewed });

    return combined;
  }
}
