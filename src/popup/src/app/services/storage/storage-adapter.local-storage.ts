import { Injectable } from '@angular/core';
import { filter, map, Observable, shareReplay, Subject, tap } from 'rxjs';
import { StorageKey, STORAGE_KEYS } from '@extension/shared/consts';
import { StorageSchema } from '@extension/shared/models';
import { generateRaceData, generateStormData } from '@extension/shared/utils/random-data';
import { IStorageAdapter } from './storage-adapter.interface';

@Injectable()
export class LocalStorageService implements IStorageAdapter {
  private readonly changesSubject: Subject<StorageKey[]> = new Subject<StorageKey[]>();

  public readonly changes$: Observable<StorageKey[]> = this.changesSubject.asObservable().pipe(
    tap((changes: StorageKey[]) => console.log('localStorage changes', changes)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor() {
    this.initializeTestData();
  }

  private initializeTestData(): void {
    // Only initialize test data if localStorage doesn't already contain race data
    if (localStorage.getItem(STORAGE_KEYS.RACES) === null) {
      localStorage.setItem(STORAGE_KEYS.RACES, JSON.stringify(generateRaceData()));
      localStorage.setItem(STORAGE_KEYS.OPEN_RACES, JSON.stringify({}));
    }

    // Only initialize test data if localStorage doesn't already contain storm data
    if (localStorage.getItem(STORAGE_KEYS.STORMS) === null) {
      localStorage.setItem(STORAGE_KEYS.STORMS, JSON.stringify(generateStormData()));
      localStorage.setItem(STORAGE_KEYS.OPEN_STORMS, JSON.stringify({}));
    }
  }

  public onKeysChanged(keys: Set<StorageKey>): Observable<StorageKey[]> {
    return this.changes$.pipe(
      map((changes: StorageKey[]) => changes.filter((key: StorageKey) => keys.has(key))),
      filter((matchingKeys: StorageKey[]) => matchingKeys.length > 0),
    );
  }

  public async getAll(): Promise<Partial<StorageSchema>> {
    const keys: StorageKey[] = [STORAGE_KEYS.CURRENT_TAB, STORAGE_KEYS.RACES, STORAGE_KEYS.STORMS];
    const result: Partial<StorageSchema> = {};

    for (let i: number = 0; i < keys.length; i++) {
      const key: StorageKey = keys[i];
      const value: string | null = localStorage.getItem(key);
      if (value) {
        result[key] = JSON.parse(value);
      }
    }

    return result;
  }

  public async get<K extends keyof StorageSchema>(
    keys: K | readonly K[],
  ): Promise<Pick<StorageSchema, K>> {
    const result: Pick<StorageSchema, K> = {} as Pick<StorageSchema, K>;
    const keyList: K[] = Array.isArray(keys) ? [...keys] : [keys];

    for (const key of keyList) {
      const value: string | null = localStorage.getItem(key as string);
      if (value !== null) {
        result[key] = JSON.parse(value);
      }
    }

    return result;
  }

  public async set(items: Partial<StorageSchema>): Promise<void> {
    const keys: StorageKey[] = Object.keys(items) as StorageKey[];
    keys.forEach((key: StorageKey) => localStorage.setItem(key, JSON.stringify(items[key])));
    this.changesSubject.next(keys);
  }

  public async remove(keys: StorageKey | StorageKey[]): Promise<void> {
    const keyArray: StorageKey[] = Array.isArray(keys) ? keys : [keys];
    keyArray.forEach((key: StorageKey) => localStorage.removeItem(key));
  }
}
