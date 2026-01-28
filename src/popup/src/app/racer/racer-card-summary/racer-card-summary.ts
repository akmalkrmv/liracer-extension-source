import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { IRace, ISettings } from '@extension/shared/models';
import { LINKS } from '@extension/shared/consts';
import { RelativeDatePipe } from '../../pipes/relative-date-pipe';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: '[app-racer-card-summary]',
  imports: [RelativeDatePipe],
  templateUrl: './racer-card-summary.html',
  styles: ``,
})
export class RacerCardSummary {
  protected readonly settingsService: SettingsService = inject(SettingsService);
  protected readonly settings: Signal<ISettings> = this.settingsService.settings;

  public readonly value: InputSignal<IRace> = input.required<IRace>({ alias: 'run' });
  public readonly combined: InputSignal<boolean> = input<boolean>(false);
  public readonly raceLinkPrefix: string = LINKS.RACER;

  prependUrl(url: string, path: string) {
    return `${url}${path}`;
  }
}
