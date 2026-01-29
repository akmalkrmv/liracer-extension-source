import { Component, inject, signal, WritableSignal, computed, Signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IRace, IStorm } from '@extension/shared/models';
import { RangeFilter } from '../../range-filter/range-filter';
import { ClipboardService } from '../../services/clipboard.service';
import { DateService } from '../../services/datetime/date.service';
import { DownloadService } from '../../services/download.service';
import { RacerService } from '../../services/racer';
import { SnackbarManager } from '../../services/snackbar.service';
import { StormService } from '../../services/storm';
import { STAT_DEFINITIONS, DEFAULT_RACER_STATS, DEFAULT_STORM_STATS } from './consts';
import { StatDefinition, StatisticsSelection, StatMetricOptions } from './models';
import { PuzzleExportService } from './services/puzzle-export.service';
import { DateRange } from '../../models';

const EXPORT_MESSAGES = {
  NOTHING_TO_COPY: 'Nothing to copy',
  NOTHING_TO_DOWNLOAD: 'Nothing to download',
  COPIED: 'Copied!',
  DOWNLOADED: 'Downloaded!',
  PUZZLES_COPIED: 'Puzzles copied to clipboard!',
  NO_RUNS_AVAILABLE: 'No runs available for the selected date range.',
};

@Component({
  selector: 'app-puzzle-export',
  imports: [CommonModule, FormsModule, RangeFilter, MatIconModule],
  templateUrl: './puzzle-export.html',
  styleUrls: ['./puzzle-export.css'],
})
export class PuzzleExport {
  private readonly racerService: RacerService = inject(RacerService);
  private readonly stormService: StormService = inject(StormService);
  private readonly puzzleExport: PuzzleExportService = inject(PuzzleExportService);
  private readonly clipboard: ClipboardService = inject(ClipboardService);
  private readonly download: DownloadService = inject(DownloadService);
  private readonly snackbar: SnackbarManager = inject(SnackbarManager);
  private readonly dateService: DateService = inject(DateService);
  private readonly datePipe: DatePipe = inject(DatePipe);

  // Expose stat definitions for template iteration
  protected readonly statDefinitions: StatDefinition[] = STAT_DEFINITIONS;

  // State
  protected readonly runType: WritableSignal<'racer' | 'storm'> = signal('racer');
  protected readonly dateRange: WritableSignal<DateRange> = signal('all');
  protected readonly includeStats: WritableSignal<boolean> = signal(true);
  protected readonly statisticsSelection: WritableSignal<StatisticsSelection> =
    signal(DEFAULT_RACER_STATS);

  // Computed signals
  protected readonly allRuns: Signal<IRace[] | IStorm[]> = computed(() => {
    return this.runType() === 'racer' ? this.racerService.races() : this.stormService.storms();
  });

  protected readonly filteredRuns: Signal<(IRace | IStorm)[]> = computed(() => {
    const runs: IRace[] | IStorm[] = this.allRuns();
    const range: DateRange = this.dateRange();

    if (range === 'all') {
      return runs;
    }

    const rangeFilter: Function | null = this.dateService.getDateRangeFilter(range);
    if (!rangeFilter) {
      return runs;
    }

    return runs.filter((run: IRace | IStorm) => rangeFilter(run.timestamp));
  });

  protected readonly unsolvedCount: Signal<number> = computed(() => {
    return this.puzzleExport.countUnsolvedPuzzles(this.filteredRuns() as IRace[] | IStorm[]);
  });

  protected readonly exportContent: Signal<string> = computed(() => {
    const runs: IRace[] | IStorm[] = this.filteredRuns() as IRace[] | IStorm[];
    const type: 'racer' | 'storm' = this.runType();
    // Ensure this computed depends on all relevant signals
    const _includeStats: boolean = this.includeStats();
    const _statSelection: StatisticsSelection = this.statisticsSelection();

    if (!runs.length) {
      return EXPORT_MESSAGES.NO_RUNS_AVAILABLE;
    }

    const options = {
      includeStats: _includeStats,
      type: type as 'racer' | 'storm',
      selectedStats: _includeStats ? _statSelection : undefined,
    };

    if (type === 'racer') {
      return this.puzzleExport.generateRacerPuzzleExport(runs as IRace[], options);
    } else {
      return this.puzzleExport.generateStormPuzzleExport(runs as IStorm[], options);
    }
  });

  protected readonly previewContent: Signal<string> = computed(() => {
    return this.puzzleExport.getPreview(this.exportContent());
  });

  protected updateStatMetric(
    statKey: keyof StatisticsSelection,
    metricType: 'enabled' | 'average' | 'min' | 'max',
    value: boolean,
  ): void {
    const current: StatisticsSelection = this.statisticsSelection();
    const statOption: StatMetricOptions | undefined = current[statKey];

    if (!statOption) return;

    const updated: StatisticsSelection = {
      ...current,
      [statKey]: {
        ...statOption,
        [metricType]: value,
      },
    };

    this.statisticsSelection.set(updated);
  }

  private isValidContent(content: string): boolean {
    return content !== EXPORT_MESSAGES.NO_RUNS_AVAILABLE && content.trim().length > 0;
  }

  protected selectRunType(type: 'racer' | 'storm'): void {
    this.runType.set(type);
    const defaults: StatisticsSelection =
      type === 'racer' ? DEFAULT_RACER_STATS : DEFAULT_STORM_STATS;
    this.statisticsSelection.set(defaults);
  }

  protected getFilteredStats(): typeof STAT_DEFINITIONS {
    const type: 'racer' | 'storm' = this.runType();
    return STAT_DEFINITIONS.filter((def) => def.stats === 'all' || def.stats === type);
  }

  protected async copyToClipboard(): Promise<void> {
    const content: string = this.exportContent();
    if (!this.isValidContent(content)) {
      this.snackbar.show(EXPORT_MESSAGES.NOTHING_TO_COPY);
      return;
    }

    await this.clipboard.copy(content, EXPORT_MESSAGES.PUZZLES_COPIED);
    this.snackbar.show(EXPORT_MESSAGES.COPIED);
  }

  protected downloadAsFile(): void {
    const content: string = this.exportContent();
    if (!this.isValidContent(content)) {
      this.snackbar.show(EXPORT_MESSAGES.NOTHING_TO_DOWNLOAD);
      return;
    }

    const today: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const filename: string = `unsolved-puzzles-${this.runType()}-${today}.txt`;

    this.download.downloadAsTextFile(content, filename);
    this.snackbar.show(EXPORT_MESSAGES.DOWNLOADED);
  }
}
