import { Component, inject, input, InputSignal, WritableSignal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LINKS } from '@extension/shared/consts';
import { PuzzleId, TrainingGroupType, TrainingGroup } from '@extension/shared/models';
import { IRun, IGroupedRace, IGroupedStorm } from '../../models';
import { TrainingService } from '../../services/training.service';
import { LinkHandlerService } from '../../services/link-handler.service';
import { sum } from '../../services/utils';

@Component({
  selector: 'app-train-button',
  imports: [MatIcon],
  templateUrl: './train-button.html',
  styleUrl: './train-button.css',
})
export class TrainButton {
  private readonly trainingService: TrainingService = inject(TrainingService);
  private readonly linkHandler: LinkHandlerService = inject(LinkHandlerService);

  public readonly type: InputSignal<TrainingGroupType> = input.required();
  public readonly group: InputSignal<IGroupedRace | IGroupedStorm> = input.required();

  protected readonly currentTrainingGroup: WritableSignal<TrainingGroup | null> =
    this.trainingService.currentTrainingGroup;

  public startTraining(group: IGroupedRace | IGroupedStorm) {
    const puzzles: PuzzleId[] = group.runs.flatMap((run: IRun) => run.unsolved);
    const lastPuzzleId: PuzzleId | undefined = puzzles[puzzles.length - 1];

    this.trainingService.setPuzzlesForTraining(this.type(), group.timestamp, puzzles);
    this.linkHandler.navigate(`${LINKS.TRAINING}${lastPuzzleId}`, false);
  }

  public stopTraining() {
    this.trainingService.clearTraining();
  }

  public isTrainingAvailable(group: IGroupedRace | IGroupedStorm): boolean {
    const unsolvedCounts: number[] = group?.runs?.flatMap((run: IRun) => run.unsolved.length);
    return sum(unsolvedCounts) > 0;
  }
}
