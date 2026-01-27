import {STORAGE_KEYS} from '../shared/consts/storage-keys.const';
import {IRace, IStorm} from '../shared/models';

export function debug_script(message: {text: string}) {
  chrome.storage.local.set({debug_content: message.text});
  return;
}

export function closeTab(sender: chrome.runtime.MessageSender) {
  if (sender.tab && sender.tab.id) {
    chrome.tabs.remove(sender.tab.id);
  }
}

export function replacePuzzleFullPathsWithOnlyPuzzleIds() {
  const extractLastSegment = (href: string) => href.split('/').pop()!;

  chrome.storage.local.get([STORAGE_KEYS.RACES, STORAGE_KEYS.STORMS], (data) => {
    const races: Record<string, IRace> = (data.races as Record<string, IRace>) || {};
    const storms: Record<string, IStorm> = (data.storms as Record<string, IStorm>) || {};

    for (const raceId in races) {
      const race: IRace = races[raceId];
      races[raceId] = {
        ...race,
        solved: race.solved.map(extractLastSegment),
        unsolved: race.unsolved.map(extractLastSegment),
        reviewed: race.reviewed.map(extractLastSegment),
      };
    }

    for (const stormId in storms) {
      const storm: IStorm = storms[stormId];
      storms[stormId] = {
        ...storm,
        solved: storm.solved.map(extractLastSegment),
        unsolved: storm.unsolved.map(extractLastSegment),
        reviewed: storm.reviewed.map(extractLastSegment),
      };
    }

    chrome.storage.local.set({races, storms, debug_content: storms.length});
  });
}
