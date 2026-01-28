import { Component, inject, WritableSignal } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { ISettings } from '@extension/shared/models';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: 'settings.html',
  styleUrls: ['settings.css'],
})
export class Settings {
  private readonly service: SettingsService = inject(SettingsService);
  protected readonly settings: WritableSignal<ISettings> = this.service.settings;

  setSetting<P extends Paths<ISettings>>(path: P, value: PathValue<ISettings, P>) {
    this.service.setSetting(path, value);
  }
}
