import {STORAGE_KEYS} from '../../shared/consts/storage-keys.const';
import {IRace, IStorm} from '../../shared/models';
import {PuzzleSolvedMessage, MessageTypes} from '../../shared/messages';

export function updatePuzzleStateToReviewed(message: PuzzleSolvedMessage) {
  const puzzleId = message.id;

  chrome.storage.local.get([STORAGE_KEYS.RACES, STORAGE_KEYS.STORMS], (data) => {
    const races: Record<string, IRace> = (data.races as Record<string, IRace>) || {};
    const storms: Record<string, IStorm> = (data.storms as Record<string, IStorm>) || {};

    for (const raceId in races) {
      const race: IRace = races[raceId];

      // Look for the puzzle
      const puzzleIndex: number = race.unsolved.findIndex((url) => url.endsWith('/' + puzzleId) || url === puzzleId);

      if (puzzleIndex !== -1) {
        const puzzleUrl = race.unsolved[puzzleIndex];

        race.unsolved.splice(puzzleIndex, 1); // remove from unsolved
        race.reviewed.push(puzzleUrl); // add to reviewed

        // chrome.storage.onChanged issues
        // chrome.storage.local.set({races});
        // chrome.storage.local.set({races: {...races}});
        setTimeout(() => chrome.storage.local.set({races: {...races}}), 50);

        chrome.runtime.sendMessage({type: MessageTypes.races_updated});

        return; // IMPORTANT — prevents overwriting
      }
    }

    for (const stormId in storms) {
      const storm: IStorm = storms[stormId];

      // Look for the puzzle
      const puzzleIndex: number = storm.unsolved.findIndex((url) => url.endsWith('/' + puzzleId) || url === puzzleId);

      if (puzzleIndex !== -1) {
        const puzzleUrl = storm.unsolved[puzzleIndex];

        storm.unsolved.splice(puzzleIndex, 1); // remove from unsolved
        storm.reviewed.push(puzzleUrl); // add to reviewed

        // chrome.storage.onChanged issues
        // chrome.storage.local.set({storms});
        // chrome.storage.local.set({storms: {...storms}});
        setTimeout(() => chrome.storage.local.set({storms: {...storms}}), 50);

        chrome.runtime.sendMessage({type: MessageTypes.storms_updated});

        return; // IMPORTANT — prevents overwriting
      }
    }
  });
}
