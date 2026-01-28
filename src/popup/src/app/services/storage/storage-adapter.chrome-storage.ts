import { DestroyRef, inject, Injectable } from '@angular/core';
import { Subject, Observable, map, filter, shareReplay, tap } from 'rxjs';
import { StorageKey } from '@extension/shared/consts';
import { StorageSchema } from '@extension/shared/models';
import { IStorageAdapter } from './storage-adapter.interface';

type StorageChangeType = { [key: string]: chrome.storage.StorageChange };
type StorageChangeListenerFunc = (changes: StorageChangeType) => void;

@Injectable()
export class ChromeStorageService implements IStorageAdapter {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly changesSubject: Subject<StorageKey[]> = new Subject<StorageKey[]>();

  public readonly changes$: Observable<StorageKey[]> = this.changesSubject.asObservable().pipe(
    tap((changes: StorageKey[]) => console.log('chrome.storage.onChanged changes', changes)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private storageListener: StorageChangeListenerFunc = (changes: StorageChangeType) => {
    this.changesSubject.next(Object.keys(changes) as StorageKey[]);
  };

  constructor() {
    chrome.storage.onChanged.addListener(this.storageListener);
    this.destroyRef.onDestroy(() => {
      chrome.storage.onChanged.removeListener(this.storageListener);
      this.changesSubject.complete();
    });
  }

  public onKeysChanged(keys: Set<StorageKey>): Observable<StorageKey[]> {
    return this.changes$.pipe(
      map((changes: StorageKey[]) => changes.filter((key: StorageKey) => keys.has(key))),
      filter((matchingKeys: StorageKey[]) => matchingKeys.length > 0),
    );
  }

  public async getAll(): Promise<Partial<StorageSchema>> {
    return chrome.storage.local.get(null);
  }

  public async get<K extends keyof StorageSchema>(
    keys: K | readonly K[],
  ): Promise<Pick<StorageSchema, K>> {
    return chrome.storage.local.get(keys as K | K[]);
  }

  public async set(items: Partial<StorageSchema>): Promise<void> {
    await chrome.storage.local.set(items);
  }

  public async remove(keys: StorageKey | StorageKey[]): Promise<void> {
    await chrome.storage.local.remove(keys as string | string[]);
  }
}
