import {STORAGE_KEYS} from '../../shared/consts/storage-keys.const';
import {IStorm} from '../../shared/models';
import {GetStormRunsMessage, PuzzleStormFinishedMessage} from '../../shared/messages';

export function getStormRuns(message: GetStormRunsMessage, _sendResponse: (response?: unknown) => void) {
  chrome.storage.local.get([STORAGE_KEYS.STORMS], (data) => {
    const storms: Record<string, IStorm> = (data.races as Record<string, IStorm>) || {};
    _sendResponse(storms);
  });
}

export function saveStormInformation(message: PuzzleStormFinishedMessage) {
  chrome.storage.local.get([STORAGE_KEYS.STORMS], (data) => {
    const storms: Record<string, IStorm> = (data.storms as Record<string, IStorm>) || {};

    storms[message.stormId] = {
      stormId: message.stormId,
      timestamp: message.timestamp,
      // puzzles
      solved: message.solved || [],
      unsolved: message.unsolved || [],
      reviewed: message.reviewed || [],
      // stats
      score: message.score || 0,
      moves: message.moves || 0,
      accuracy: message.accuracy || 0,
      combo: message.combo || 0,
      time: message.time || 0,
      timePerMove: message.timePerMove || 0,
      highestSolved: message.highestSolved || 0,
    };

    chrome.storage.local.set({storms});
  });
}
