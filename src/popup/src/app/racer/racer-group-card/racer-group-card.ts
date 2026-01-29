import { Component, input, InputSignal } from '@angular/core';
import { IGroupedRace } from '../../models/grouped-race.model';
import { RacerCard } from '../racer-card/racer-card';
import { RacerGroupCardHeader } from '../racer-group-card-header/racer-group-card-header';
import { IRacerFilter } from '../../models/racer-filter.model';
import { IRace, PuzzleId, Race } from '@extension/shared/models';

@Component({
  selector: 'app-racer-group-card',
  imports: [RacerCard, RacerGroupCardHeader],
  templateUrl: './racer-group-card.html',
  styles: ``,
})
export class RacerGroupCard {
  public readonly value: InputSignal<IGroupedRace> = input.required<IGroupedRace>();
  public readonly filter: InputSignal<IRacerFilter> = input.required<IRacerFilter>();

  protected combine(group: IGroupedRace): IRace {
    const uniqueKey: string = String(group.timestamp);
    const combined = new Race(uniqueKey);

    let solved: PuzzleId[] = [];
    let unsolved: PuzzleId[] = [];
    let reviewed: PuzzleId[] = [];

    group.runs.forEach((run: IRace) => {
      solved = [...new Set([...solved, ...run.solved])]; // Combine and remove duplicates
      unsolved = [...new Set([...unsolved, ...run.unsolved])];
      reviewed = [...new Set([...reviewed, ...run.reviewed])];
    });

    // Set puzzles
    combined.setPuzzles({ solved, unsolved, reviewed });

    return combined;
  }
}
