import { StorageKey } from '@extension/shared/consts';
import { StorageSchema } from '@extension/shared/models';
import { Observable } from 'rxjs';

export interface IStorage {
  getAll(): Promise<Partial<StorageSchema>>;
  get<K extends keyof StorageSchema>(keys: K | readonly K[]): Promise<Pick<StorageSchema, K>>;
  set(items: Partial<StorageSchema>): Promise<void>;
  remove(keys: StorageKey | StorageKey[]): Promise<void>;
}

export interface IStorageChangeNotifier {
  changes$: Observable<StorageKey[]>;
  onKeysChanged(keys: Set<StorageKey>): Observable<StorageKey[]>;
}

export interface IStorageAdapter extends IStorage, IStorageChangeNotifier {}
