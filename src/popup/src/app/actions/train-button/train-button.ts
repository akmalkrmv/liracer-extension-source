import { Component, inject, input, InputSignal, WritableSignal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  PuzzleId,
  IRace,
  IStorm,
  TrainingGroupType,
  TrainingGroup,
} from '@extension/shared/models';
import { TrainingService } from '../../services/training.service';
import { IGroupedRace, IGroupedStorm } from '../../models';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-train-button',
  imports: [MatIcon],
  templateUrl: './train-button.html',
  styles: `
    button {
      width: 100%;
      /*
       display: flex;
       align-items: center;
       justify-content: center;

       background-color: var(--solved-color) !important;
       border-color: var(--solved-color) !important;

       text-transform: uppercase;

       mat-icon {
         --size: 0.9rem;

         height: var(--size);
         font-size: var(--size);
         line-height: var(--size);
       }*/
    }
  `,
})
export class TrainButton {
  private readonly trainingService: TrainingService = inject(TrainingService);

  public readonly type: InputSignal<TrainingGroupType> = input.required();
  public readonly group: InputSignal<IGroupedRace | IGroupedStorm> = input.required();

  protected readonly currentTrainingGroup: WritableSignal<TrainingGroup | null> =
    this.trainingService.currentTrainingGroup;

  startTraining(group: IGroupedRace | IGroupedStorm) {
    const puzzles: PuzzleId[] = group.runs.flatMap((run: IRace | IStorm) => run.unsolved);
    this.trainingService.setPuzzlesForTraining(this.type(), group.timestamp, puzzles);
  }

  stopTraining() {
    this.trainingService.clearTraining();
  }
}
