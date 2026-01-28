import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { ISettings, IStorm } from '@extension/shared/models';
import { RelativeDatePipe } from '../../pipes/relative-date-pipe';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: '[app-storm-card-summary]',
  imports: [RelativeDatePipe],
  templateUrl: './storm-card-summary.html',
  styles: `
    .summary-row-subtitle {
      margin-block-end: var(--space-xs);
    }

    .summary-row-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-columns: auto auto;
      gap: 0 var(--space-sm);
    }
  `,
})
export class StormCardSummary {
  public readonly value: InputSignal<IStorm> = input.required<IStorm>();

  protected readonly settingsService: SettingsService = inject(SettingsService);
  protected readonly settings: Signal<ISettings> = this.settingsService.settings;
  
  getRandomGrowthIcon() {
    return Math.random() > 0.5 ? 'north_east' : 'north_west';
  }
}
