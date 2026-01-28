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

  combine(group: IGroupedRace): IRace {
    const uniqueKey: string = String(group.timestamp);
    const combined = new Race(uniqueKey);

    let allSolved: PuzzleId[] = [];
    let allUnsolved: PuzzleId[] = [];
    let allReviewed: PuzzleId[] = [];

    group.runs.forEach((run: IRace) => {
      allSolved = [...new Set([...allSolved, ...run.solved])]; // Combine and remove duplicates
      allUnsolved = [...new Set([...allUnsolved, ...run.unsolved])];
      allReviewed = [...new Set([...allReviewed, ...run.reviewed])];
    });

    // Set puzzles
    combined.setPuzzles({
      solved: allSolved,
      unsolved: allUnsolved,
      reviewed: allReviewed,
    });

    return combined;
  }
}
