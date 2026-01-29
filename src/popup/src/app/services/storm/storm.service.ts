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
import { IStorm } from '@extension/shared/models';
import { IGroupedStorm, IGroupingConfig, IStormFilter } from '../../models';
import { RunGroupingService } from '../run-grouping.service';
import { IStorageAdapter, STORAGE_ADAPTER } from '../storage';
import { StormStatCalculator } from '../stats-calculator';

const DEFAULT_FILTERS: IStormFilter = {
  dateRange: 'all',
  groupBy: 'relative',
  viewMode: 'grouped',
};

@Injectable({ providedIn: 'root' })
export class StormService {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly storage: IStorageAdapter = inject(STORAGE_ADAPTER);
  private readonly grouping: RunGroupingService<IStorm> = inject(RunGroupingService);
  private readonly reloadKeys: Set<StorageKey> = new Set<StorageKey>([STORAGE_KEYS.STORMS]);
  private readonly calculator: StormStatCalculator = new StormStatCalculator();

  public readonly storms: WritableSignal<IStorm[]> = signal<IStorm[]>([]);
  public readonly groups: Signal<IGroupedStorm[]> = computed(() => this.grouped(this.storms()));
  public readonly filter: WritableSignal<IStormFilter> = signal<IStormFilter>(DEFAULT_FILTERS);
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
    this.storms.set(await this.getAllStormRuns());
  }

  public async getAllStormRuns(): Promise<IStorm[]> {
    const data: { storms: Record<string, IStorm> } = await this.storage.get(STORAGE_KEYS.STORMS);
    const storms: Record<string, IStorm> = data[STORAGE_KEYS.STORMS];
    console.log('[StormService] storms', storms);
    return Object.values(storms || {});
  }

  private grouped(storms: IStorm[]): IGroupedStorm[] {
    return this.grouping.groupRunsByDate(storms, this.calculator, this.config()) as IGroupedStorm[];
  }

  private getConfig(filter: IStormFilter): IGroupingConfig {
    return {
      strategy: filter.groupBy === 'date' ? 'date' : 'relative',
      labeling: filter.groupBy === 'date' ? 'date' : 'relative',
    };
  }
}
