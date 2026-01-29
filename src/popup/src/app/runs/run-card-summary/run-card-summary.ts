import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { IRace, ISettings, IStorm } from '@extension/shared/models';
import { RelativeDatePipe } from '../../pipes/relative-date-pipe';
import { SettingsService } from '../../services/settings.service';
import { IRun } from '../../models/run.model';

@Component({
  selector: '[app-run-card-summary]',
  imports: [RelativeDatePipe],
  templateUrl: './run-card-summary.html',
  styles: ``,
})
export class RunCardSummary<T extends IRun> {
  protected readonly settingsService: SettingsService = inject(SettingsService);
  protected readonly settings: Signal<ISettings> = this.settingsService.settings;

  public readonly value: InputSignal<T> = input.required<T>({ alias: 'run' });
  public readonly combined: InputSignal<boolean> = input<boolean>(false);
  public readonly linkPrefix: InputSignal<string> = input.required();

  protected prependUrl(url: string, path: string) {
    return `${url}${path}`;
  }

  protected isRacer(item: unknown): item is IRace {
    return 'raceId' in (item as T);
  }

  protected isStorm(item: unknown): item is IStorm {
    return 'stormId' in (item as T);
  }
}
