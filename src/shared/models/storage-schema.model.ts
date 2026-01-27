import {STORAGE_KEYS} from '../consts/storage-keys.const';
import {IRace} from './race.model';
import {ISettings} from './settings.model';
import {IStorm} from './storm.model';
import {TrainingGroup} from './training-group.model';

export type StorageSchema = {
  [STORAGE_KEYS.CURRENT_TAB]: string;
  [STORAGE_KEYS.OPEN_RACES]: Record<string, boolean>;
  [STORAGE_KEYS.OPEN_STORMS]: Record<string, boolean>;
  [STORAGE_KEYS.POPUP_SCROLL_POSITION]: number;
  [STORAGE_KEYS.RACES]: Record<string, IRace>;
  [STORAGE_KEYS.SETTINGS]: ISettings;
  [STORAGE_KEYS.STORMS]: Record<string, IStorm>;
  [STORAGE_KEYS.TRAINING]: TrainingGroup | null;
};
