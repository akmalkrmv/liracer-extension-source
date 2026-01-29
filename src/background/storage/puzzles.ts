import {STORAGE_KEYS} from '../../shared/consts/storage-keys.const';
import {IRace, IRun, IStorm, TrainingGroup} from '../../shared/models';
import {PuzzleSolvedMessage} from '../../shared/messages';

export function updatePuzzleStateToReviewed(message: PuzzleSolvedMessage) {
  const puzzleId: string = message.id;

  chrome.storage.local.get([STORAGE_KEYS.RACES, STORAGE_KEYS.STORMS, STORAGE_KEYS.TRAINING], (data) => {
    const races: Record<string, IRace> = (data.races as Record<string, IRace>) || {};
    const storms: Record<string, IStorm> = (data.storms as Record<string, IStorm>) || {};
    const training: TrainingGroup = (data.training as TrainingGroup) || {};

    const storageUpdate = {
      races: movePuzzleToReviewed(races, puzzleId),
      storms: movePuzzleToReviewed(storms, puzzleId),
      training: removePuzzleFromTraining(training, puzzleId),
    };

    // Single unified storage update
    setTimeout(() => chrome.storage.local.set(storageUpdate), 50);
  });
}

function movePuzzleToReviewed(runs: Record<string, IRun>, puzzleId: string): Record<string, IRun> {
  const updatedRuns: Record<string, IRun> = {};

  for (const runId in runs) {
    const run: IRun = runs[runId];
    const puzzleIndex: number = run.unsolved.findIndex((url: string) => url.endsWith('/' + puzzleId) || url === puzzleId);

    if (puzzleIndex !== -1) {
      const puzzleUrl: string = run.unsolved[puzzleIndex];
      updatedRuns[runId] = {
        ...run,
        unsolved: run.unsolved.filter((_: string, index: number) => index !== puzzleIndex),
        reviewed: [...run.reviewed, puzzleUrl],
      };
    } else {
      updatedRuns[runId] = run;
    }
  }

  return updatedRuns;
}

function removePuzzleFromTraining(training: TrainingGroup | undefined, puzzleId: string): TrainingGroup | null {
  if (!training?.puzzles?.length) {
    return null;
  }

  const filtered: string[] = training.puzzles
    .map((link: string) => link.split('/').pop()) //
    .filter((id: string | undefined): id is string => id !== undefined && id !== puzzleId);

  return filtered.length > 0 ? {...training, puzzles: filtered} : null;
}
