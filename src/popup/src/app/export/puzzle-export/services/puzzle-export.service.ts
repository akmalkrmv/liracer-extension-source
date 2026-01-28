import { Injectable } from '@angular/core';
import { IRace, IStorm, PuzzleId } from '@extension/shared/models';
import { LINKS } from '@extension/shared/consts';
import {
  IStatsExportGenerator,
  RacerStatsExportGenerator,
  StormStatsExportGenerator,
} from './stats-export-generator';
import { PuzzleExportOptions } from '../models';
import { NEW_LINE, DIVIDER } from '../consts';

@Injectable({ providedIn: 'root' })
export class PuzzleExportService {
  private readonly racerStatsGenerator: IStatsExportGenerator<IRace> =
    new RacerStatsExportGenerator();
  private readonly stormStatsGenerator: IStatsExportGenerator<IStorm> =
    new StormStatsExportGenerator();

  public generateRacerPuzzleExport(runs: IRace[], options: PuzzleExportOptions): string {
    return this.generatePuzzleExport(runs, options, this.racerStatsGenerator);
  }

  public generateStormPuzzleExport(runs: IStorm[], options: PuzzleExportOptions): string {
    return this.generatePuzzleExport(runs, options, this.stormStatsGenerator);
  }

  private generatePuzzleExport<T extends IRace | IStorm>(
    runs: T[],
    options: PuzzleExportOptions,
    statsGenerator: IStatsExportGenerator<T>,
  ): string {
    const unsolvedPuzzles: PuzzleId[] = this.extractUnsolvedPuzzles(runs);

    if (!unsolvedPuzzles.length) {
      return 'No unsolved puzzles found.';
    }

    const puzzleUrls: string[] = unsolvedPuzzles.map(
      (puzzleId: PuzzleId) => `${LINKS.TRAINING}${puzzleId}`,
    );
    let content: string = '';

    // Add statistics if requested
    if (options.includeStats) {
      content += statsGenerator.generate(runs, options.selectedStats);
      content += NEW_LINE;
    }

    // Add puzzles list
    content += 'UNSOLVED PUZZLES' + NEW_LINE;
    content += DIVIDER + NEW_LINE;
    content += puzzleUrls.join(NEW_LINE);

    return content;
  }

  public getPreview(content: string, maxLength: number = 500): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + `... (truncated)`;
  }

  public countUnsolvedPuzzles(runs: IRace[] | IStorm[]): number {
    return runs.reduce((count, run) => count + (run.unsolved?.length || 0), 0);
  }

  /**
   * Extract unique unsolved puzzles from runs
   */
  private extractUnsolvedPuzzles<T extends IRace | IStorm>(runs: T[]): PuzzleId[] {
    const puzzleSet: Set<PuzzleId> = new Set<PuzzleId>();
    runs.forEach((run: IRace | IStorm): void => {
      (run.unsolved || []).forEach((puzzle: PuzzleId): void => {
        puzzleSet.add(puzzle);
      });
    });
    return Array.from(puzzleSet).sort((a: PuzzleId, b: PuzzleId) => a.localeCompare(b));
  }
}
