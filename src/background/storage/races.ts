import {STORAGE_KEYS} from '../../shared/consts/storage-keys.const';
import {IRace} from '../../shared/models';
import {GetRaceRunsMessage, PuzzleRaceFinishedMessage} from '../../shared/messages';

export function getRaceRuns(message: GetRaceRunsMessage, _sendResponse: (response?: unknown) => void) {
  chrome.storage.local.get([STORAGE_KEYS.RACES], (data) => {
    const races: Record<string, IRace> = (data.races as Record<string, IRace>) || {};
    _sendResponse(races);
  });
}

export function saveRaceInformation(message: PuzzleRaceFinishedMessage) {
  chrome.storage.local.get([STORAGE_KEYS.RACES], (data) => {
    const races: Record<string, IRace> = (data.races as Record<string, IRace>) || {};

    races[message.raceId] = {
      raceId: message.raceId,
      timestamp: message.timestamp,
      // puzzles
      solved: message.solved || [],
      unsolved: message.unsolved || [],
      reviewed: message.reviewed || [],
      // stats
      score: message.score || 0,
      rank: message.rank || 0,
      totalPlayers: message.totalPlayers || 0,
    };

    chrome.storage.local.set({races});
  });
}
