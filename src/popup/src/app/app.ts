import {
  Component,
  DOCUMENT,
  effect,
  inject,
  Renderer2,
  signal,
  WritableSignal,
} from '@angular/core';
import { Navigation } from './navigation/navigation';
import { StormSection } from './storm/storm-section';
import { NavigationSection } from './models/navigation-section.model';
import { Export } from './export/export';
import { Statistics } from './statistics/statistics';
import { Settings } from './settings/settings';
import { RacerSection } from './racer/racer-section';
import { SettingsService } from './services/settings.service';
import { MatIconRegistry } from '@angular/material/icon';
import { ISettings } from '@extension/shared/models';
import { Version } from './components/version';

@Component({
  selector: 'app-root',
  imports: [Navigation, RacerSection, StormSection, Export, Statistics, Settings, Version],
  template: `
    <div class="popup-container">
      <header class="popup-header">
        <h1>LiRacer - Lichess Puzzle Tracker</h1>
      </header>
      <app-navigation [(selected)]="navigation" />
      <main class="tabs-content">
        @switch (navigation()) {
          @case ('racer') {
            <app-racer />
          }
          @case ('storm') {
            <app-storm />
          }
          @case ('export') {
            <app-export />
          }
          @case ('stats') {
            <app-statistics />
          }
          @case ('settings') {
            <app-settings />
          }
        }
      </main>
      <footer>
        <app-version />
      </footer>
    </div>
  `,
  styles: [],
})
export class App {
  private readonly iconRegistry: MatIconRegistry = inject(MatIconRegistry);
  private readonly settings: SettingsService = inject(SettingsService);
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly document: Document = inject(DOCUMENT);

  protected readonly navigation: WritableSignal<NavigationSection> = signal(
    (this.settings.settings().currentTab as NavigationSection) || 'racer',
  );

  constructor() {
    effect(() => {
      const settings: ISettings = this.settings.settings();
      this.settings.applyTheme(settings, this.renderer, this.document);
      settings.currentTab && this.navigation.set(settings.currentTab as NavigationSection);
    });
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
