export const STORAGE_KEYS = {
  RACES: 'races',
  OPEN_RACES: 'openRaces',

  STORMS: 'storms',
  OPEN_STORMS: 'openStorms',

  CURRENT_TAB: 'currentTab',
  POPUP_SCROLL_POSITION: 'popupScrollPosition',

  SETTINGS: 'settings',
  TRAINING: 'training',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
