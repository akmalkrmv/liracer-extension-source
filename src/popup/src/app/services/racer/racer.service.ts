import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { STORAGE_KEYS, StorageKey } from '@extension/shared/consts';
import { IRace } from '@extension/shared/models';
import { IGroupedRace, IGroupingConfig } from '../../models';
import { RunGroupingService } from '../run-grouping.service';
import { IRacerFilter } from '../../models/racer-filter.model';
import { IStorageAdapter, STORAGE_ADAPTER } from '../storage';
import { RacerStatsCalculator } from '../stats-calculator';

const DEFAULT_FILTERS: IRacerFilter = {
  dateRange: 'all',
  groupBy: 'relative',
  viewMode: 'grouped',
};

@Injectable({ providedIn: 'root' })
export class RacerService {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);
  private readonly grouping: RunGroupingService<IRace> = inject(RunGroupingService);
  private readonly reloadKeys: Set<StorageKey> = new Set<StorageKey>([STORAGE_KEYS.RACES]);
  private readonly calculator: RacerStatsCalculator = new RacerStatsCalculator();

  public readonly races: WritableSignal<IRace[]> = signal<IRace[]>([]);
  public readonly groups: Signal<IGroupedRace[]> = computed(() => this.grouped(this.races()));
  public readonly filter: WritableSignal<IRacerFilter> = signal<IRacerFilter>(DEFAULT_FILTERS);
  public readonly config: Signal<IGroupingConfig> = computed<IGroupingConfig>(() =>
    this.getConfig(this.filter()),
  );

  constructor() {
    this.storage
      .onKeysChanged(this.reloadKeys)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.reload());

    this.reload();
  }

  public async reload(): Promise<void> {
    this.races.set(await this.getAllRacerRuns());
  }

  public async getAllRacerRuns(): Promise<IRace[]> {
    const data: { races: Record<string, IRace> } = await this.storage.get(STORAGE_KEYS.RACES);
    const races: Record<string, IRace> = data[STORAGE_KEYS.RACES];
    console.log('[RacerService] races', races);
    return Object.values(races || {});
  }

  private grouped(races: IRace[]): IGroupedRace[] {
    return this.grouping.groupRunsByDate(races, this.calculator, this.config()) as IGroupedRace[];
  }

  private getConfig(filter: IRacerFilter): IGroupingConfig {
    return {
      strategy: filter.groupBy === 'date' ? 'date' : 'relative',
      labeling: filter.groupBy === 'date' ? 'date' : 'relative',
    };
  }
}
