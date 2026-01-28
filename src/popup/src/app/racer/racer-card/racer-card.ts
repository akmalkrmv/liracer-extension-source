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
import { IRace, ISettings } from '@extension/shared/models';
import { STORAGE_KEYS, LINKS } from '@extension/shared/consts';
import { PuzzleLinks } from '../../puzzle-links/puzzle-links';
import { RacerCardSummary } from '../racer-card-summary/racer-card-summary';
import { IStorageAdapter, STORAGE_ADAPTER } from '../../services/storage';
import { SettingsService } from '../../services/settings.service';

type TOpenRaces = Record<string, boolean>;

@Component({
  selector: 'app-racer-card',
  imports: [RacerCardSummary, PuzzleLinks],
  templateUrl: './racer-card.html',
  styleUrl: `./racer-card.css`,
})
export class RacerCard {
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);
  private readonly settingsService: SettingsService = inject(SettingsService);

  public readonly value: InputSignal<IRace> = input.required<IRace>({ alias: 'run' });
  public readonly combined: InputSignal<boolean> = input<boolean>(false);

  readonly trainingLinkPrefix: string = LINKS.TRAINING;
  readonly opens: WritableSignal<TOpenRaces> = signal<TOpenRaces>({});
  readonly isOpen: Signal<boolean> = computed(() => this.isRunOpen(this.value(), this.opens()));
  readonly settings: Signal<ISettings> = this.settingsService.settings;

  async ngOnInit() {
    this.opens.set(await this.getOpenRaces());
  }

  protected toggleDetails(event: Event, race: IRace) {
    const details = event.target as HTMLDetailsElement;
    this.saveOpenRace(race, details.open);
  }

  private async saveOpenRace(run: IRace, open: boolean) {
    const key: string = this.getKey(run);
    const updated: TOpenRaces = await this.getOpenRaces();
    open ? (updated[key] = true) : delete updated[key];
    await this.storage.set({ openRaces: updated });
  }

  private async getOpenRaces(): Promise<TOpenRaces> {
    const data = await this.storage.get(STORAGE_KEYS.OPEN_RACES);
    return data?.openRaces || {};
  }

  private isRunOpen(run: IRace, openRaces: TOpenRaces): boolean {
    const key: string = this.getKey(run);
    return openRaces[key] === true;
  }

  private getKey(run: IRace): string {
    return run.raceId || String(run.timestamp);
  }
}
