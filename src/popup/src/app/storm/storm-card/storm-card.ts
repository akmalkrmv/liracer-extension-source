import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ISettings, IStorm } from '@extension/shared/models';
import { STORAGE_KEYS, LINKS } from '@extension/shared/consts';
import { StormCardSummary } from '../storm-card-summary/storm-card-summary';
import { PuzzleLinks } from '../../puzzle-links/puzzle-links';
import { IStorageAdapter, STORAGE_ADAPTER } from '../../services/storage';
import { SettingsService } from '../../services/settings.service';

type TOpenRaces = Record<string, boolean>;

@Component({
  selector: 'app-storm-card',
  imports: [StormCardSummary, PuzzleLinks],
  templateUrl: './storm-card.html',
  styles: ``,
})
export class StormCard {
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);
  private readonly settingsService: SettingsService = inject(SettingsService);

  public readonly value: InputSignal<IStorm> = input.required<IStorm>();

  readonly trainingLinkPrefix: string = LINKS.TRAINING;
  readonly opens: WritableSignal<TOpenRaces> = signal<TOpenRaces>({});
  readonly isOpen: Signal<boolean> = computed(() => this.isRunOpen(this.value(), this.opens()));
  readonly settings: Signal<ISettings> = this.settingsService.settings;

  async ngOnInit() {
    this.opens.set(await this.getOpenStorms());
  }

  protected toggleDetails(event: Event, storm: IStorm) {
    const details = event.target as HTMLDetailsElement;
    this.saveOpenStorm(storm, details.open);
  }

  private async saveOpenStorm(run: IStorm, open: boolean): Promise<void> {
    const key: string = this.getKey(run);
    const updated: TOpenRaces = await this.getOpenStorms();
    open ? (updated[key] = true) : delete updated[key];
    await this.storage.set({ openStorms: updated });
  }

  private async getOpenStorms(): Promise<TOpenRaces> {
    const data = await this.storage.get(STORAGE_KEYS.OPEN_STORMS);
    return data?.openStorms || {};
  }

  private isRunOpen(run: IStorm, openRaces: TOpenRaces): boolean {
    const key: string = this.getKey(run);
    return openRaces[key] === true;
  }

  private getKey(run: IStorm): string {
    return run.stormId ?? run.timestamp;
  }
}
