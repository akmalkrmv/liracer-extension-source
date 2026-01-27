import {STORAGE_KEYS} from '../shared/consts/storage-keys.const';
import {ISettings} from '../shared/models';

type StorageChangeType = {[key: string]: chrome.storage.StorageChange};

const POPUP_PATH = 'popup/browser/index.html';

export async function applyViewMode() {
  const data: {settings: ISettings} = await chrome.storage.local.get([STORAGE_KEYS.SETTINGS]);
  const settings: ISettings = (data.settings as ISettings) || {};

  if (settings.viewMode === 'popup') {
    // Enable popup mode
    await chrome.action.setPopup({popup: POPUP_PATH});
    await chrome.sidePanel.setOptions({enabled: false});
  } else {
    // Enable side panel mode
    await chrome.action.setPopup({popup: ''}); // Clear popup
    await chrome.sidePanel.setOptions({path: POPUP_PATH, enabled: true});
  }
}

export function initializeViewMode() {
  // Apply on extension startup
  applyViewMode();

  // Apply when settings change
  chrome.storage.onChanged.addListener((changes: StorageChangeType) => {
    if (changes[STORAGE_KEYS.SETTINGS]) {
      applyViewMode();
    }
  });
}

// chrome.tabs.onActivated.addListener(async ({tabId}) => {
//   const {path} = await chrome.sidePanel.getOptions({tabId});
//   if (path === stormPage) {
//     chrome.sidePanel.setOptions({path: POPUP_PATH});
//   }
// });
