import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { SettingsService } from './services/settings.service';
import { STORAGE_ADAPTER_PROVIDER } from './services/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    DatePipe,
    STORAGE_ADAPTER_PROVIDER,
    provideAppInitializer(() => inject(SettingsService).initialize()),
  ],
};
