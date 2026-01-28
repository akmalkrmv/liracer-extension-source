import { InjectionToken } from '@angular/core';
import { IStorageAdapter } from './storage-adapter.interface';
import { ChromeStorageService } from './storage-adapter.chrome-storage';
import { LocalStorageService } from './storage-adapter.local-storage';

export const STORAGE_ADAPTER = new InjectionToken<IStorageAdapter>('STORAGE_ADAPTER');
export const STORAGE_ADAPTER_PROVIDER = {
  provide: STORAGE_ADAPTER,
  useFactory: () => {
    const isExtension: boolean = !!chrome?.storage?.local;
    return isExtension ? new ChromeStorageService() : new LocalStorageService();
  },
};
