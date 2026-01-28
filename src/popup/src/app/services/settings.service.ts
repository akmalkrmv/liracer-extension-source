import { inject, Injectable, Renderer2, signal, WritableSignal } from '@angular/core';
import { STORAGE_KEYS } from '@extension/shared/consts';
import { ISettings } from '@extension/shared/models';
import { IStorageAdapter, STORAGE_ADAPTER } from './storage';

const DEFAULT_SETTINGS: ISettings = {
  viewMode: 'panel',
  theme: 'system',
  currentTab: 'racer',
  session: {
    activeTab: 'racer',
    scrollPosition: 0,
  },
  racer: {
    showSolvedBadges: true,
    showSolvedPuzzles: false,
    formatting: { date: 'shortDate' },
  },
  storm: {
    showSolvedBadges: true,
    showSolvedPuzzles: false,
    formatting: { date: 'shortDate' },
  },
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);

  public readonly settings: WritableSignal<ISettings> = signal<ISettings>(DEFAULT_SETTINGS);

  public async initialize(): Promise<void> {
    this.settings.set(await this.getSettings());
  }

  public async getSettings(): Promise<ISettings> {
    const data: { settings: ISettings } = await this.storage.get(STORAGE_KEYS.SETTINGS);
    return data.settings || DEFAULT_SETTINGS;
  }

  public async setSetting<P extends Paths<ISettings>>(path: P, value: PathValue<ISettings, P>) {
    this.settings.update((prev: ISettings) => this.setByPath(prev, path, value));
    this.save(this.settings());
  }

  public async save(settings: ISettings): Promise<void> {
    return this.storage.set({ settings });
  }

  public applyTheme(settings: ISettings, renderer: Renderer2, document: Document) {
    const html: HTMLElement = document.documentElement;

    // Apply theme using Renderer2
    if (settings.theme === 'light') {
      renderer.setStyle(html, 'color-scheme', 'light');
    } else if (settings.theme === 'dark') {
      renderer.setStyle(html, 'color-scheme', 'dark');
    } else {
      renderer.removeStyle(html, 'color-scheme');
    }

    // Set data attribute for CSS selectors
    renderer.setAttribute(html, 'data-theme', `theme-${settings.theme}`);
  }

  private setByPath<T>(obj: T, path: string, value: unknown): T {
    const [key, ...rest] = path.split('.');

    if (!key) return obj;

    if (rest.length === 0) {
      return { ...(obj as any), [key]: value };
    }

    return {
      ...(obj as any),
      [key]: this.setByPath((obj as any)[key], rest.join('.'), value),
    };
  }
}
