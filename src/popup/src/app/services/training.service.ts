import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { PuzzleId, TrainingGroup, TrainingGroupType } from '@extension/shared/models';
import { STORAGE_KEYS } from '@extension/shared/consts';
import { IStorageAdapter, STORAGE_ADAPTER } from './storage';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);

  public readonly currentTrainingGroup: WritableSignal<TrainingGroup | null> =
    signal<TrainingGroup | null>(null);

  constructor() {
    this.getPuzzlesForTraining().then((group: TrainingGroup | null) => {
      this.currentTrainingGroup.set(group);
    });
  }

  public async getPuzzlesForTraining(): Promise<TrainingGroup | null> {
    const data: { training: TrainingGroup | null } = await this.storage.get(STORAGE_KEYS.TRAINING);
    const training: TrainingGroup | null = data.training;
    console.log('[TrainingService] training', training);
    return training;
  }

  public setPuzzlesForTraining(
    type: TrainingGroupType,
    date: number,
    puzzles: PuzzleId[],
  ): Promise<void> {
    const currentTrainingGroup: TrainingGroup = { type, date, puzzles };
    this.currentTrainingGroup.set(currentTrainingGroup);
    return this.storage.set({ training: currentTrainingGroup });
  }

  public clearTraining(): Promise<void> {
    this.currentTrainingGroup.set(null);
    return this.storage.set({ training: null });
  }
}
