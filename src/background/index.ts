import {
  RuntimeMessage,
  PuzzleRaceFinishedMessage,
  PuzzleStormFinishedMessage,
  PuzzleSolvedMessage,
  DebugMessage,
  GetRaceRunsMessage,
  GetStormRunsMessage,
} from '../shared/messages';
import {initializeViewMode} from './viewMode';
import {getRaceRuns, saveRaceInformation} from './storage/races';
import {getStormRuns, saveStormInformation} from './storage/storms';
import {updatePuzzleStateToReviewed} from './storage/puzzles';
import {debug_script, closeTab, replacePuzzleFullPathsWithOnlyPuzzleIds} from './utils';

type SendResponseType = (response?: unknown) => void;

(function () {
  // Initialize view mode handling
  initializeViewMode();

  chrome.runtime.onInstalled.addListener(() => {
    replacePuzzleFullPathsWithOnlyPuzzleIds();
  });

  chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender: chrome.runtime.MessageSender, _sendResponse: SendResponseType) => {
    switch (message.type) {
      // Race
      case 'get_race_runs':
        getRaceRuns(message as GetRaceRunsMessage, _sendResponse);
        break;
      case 'puzzle_race_finished':
        saveRaceInformation(message as PuzzleRaceFinishedMessage);
        break;

      // Storm
      case 'get_storm_runs':
        getStormRuns(message as GetStormRunsMessage, _sendResponse);
        break;
      case 'puzzle_storm_finished':
        saveStormInformation(message as PuzzleStormFinishedMessage);
        break;

      // Training
      case 'puzzle_solved_single':
        updatePuzzleStateToReviewed(message as PuzzleSolvedMessage);
        break;

      // Other
      case 'debug_script':
        debug_script(message as DebugMessage);
        break;
      case 'close_tab':
        closeTab(sender);
        break;

      default:
        break;
    }
  });
})();
