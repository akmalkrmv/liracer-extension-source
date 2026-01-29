import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { IRace, ISettings, IStorm } from '@extension/shared/models';
import { STORAGE_KEYS, LINKS } from '@extension/shared/consts';
import { PuzzleLinks } from '../../puzzle-links/puzzle-links';
import { IStorageAdapter, STORAGE_ADAPTER } from '../../services/storage';
import { SettingsService } from '../../services/settings.service';
import { RunCardSummary } from '../run-card-summary/run-card-summary';
import { IRun } from '../../models/run.model';

type TOpenRaces = Record<string, boolean>;

@Component({
  selector: 'app-run-card',
  imports: [RunCardSummary, PuzzleLinks],
  templateUrl: './run-card.html',
  styleUrl: `./run-card.css`,
})
export class RunCard<T extends IRun> {
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);
  private readonly settingsService: SettingsService = inject(SettingsService);

  public readonly value: InputSignal<T> = input.required<T>({ alias: 'run' });
  public readonly combined: InputSignal<boolean> = input<boolean>(false);

  readonly trainingLinkPrefix: string = LINKS.TRAINING;
  readonly opens: WritableSignal<TOpenRaces> = signal<TOpenRaces>({});
  readonly isOpen: Signal<boolean> = computed(() => this.isRunOpen(this.value(), this.opens()));
  readonly settings: Signal<ISettings> = this.settingsService.settings;

  async ngOnInit() {
    this.opens.set(await this.getOpenRaces());
  }

  protected getId(run: T): string {
    return this.isRacer(run) ? run.raceId : this.isStorm(run) ? run.stormId : '';
  }

  protected toggleDetails(event: Event, race: T) {
    const details = event.target as HTMLDetailsElement;
    this.saveOpenRace(race, details.open);
  }

  private async saveOpenRace(run: T, open: boolean) {
    const key: string = this.getKey(run);
    const updated: TOpenRaces = await this.getOpenRaces();
    open ? (updated[key] = true) : delete updated[key];
    await this.storage.set({ openRaces: updated });
  }

  private async getOpenRaces(): Promise<TOpenRaces> {
    const data = await this.storage.get(STORAGE_KEYS.OPEN_RACES);
    return data?.openRaces || {};
  }

  private isRunOpen(run: T, openRaces: TOpenRaces): boolean {
    const key: string = this.getKey(run);
    return openRaces[key] === true;
  }

  private getKey(run: T): string {
    return this.getId(run) || String(run.timestamp);
  }

  private isRacer(item: unknown): item is IRace {
    return 'raceId' in (item as T);
  }

  private isStorm(item: unknown): item is IStorm {
    return 'stormId' in (item as T);
  }
}
