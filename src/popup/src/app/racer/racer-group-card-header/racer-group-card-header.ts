import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { IGroupedRace } from '../../models/grouped-race.model';
import { DatePipe } from '@angular/common';
import { ClipboardService } from '../../services/clipboard.service';
import { TrainButton } from '../../actions/train-button/train-button';
import { SettingsService } from '../../services/settings.service';
import { ISettings } from '@extension/shared/models';

@Component({
  selector: 'app-racer-group-card-header',
  imports: [DatePipe, TrainButton],
  providers: [DatePipe],
  templateUrl: './racer-group-card-header.html',
  styleUrl: './racer-group-card-header.css',
})
export class RacerGroupCardHeader {
  private readonly datePipe: DatePipe = inject(DatePipe);
  private readonly clipboard: ClipboardService = inject(ClipboardService);
  private readonly settingsService: SettingsService = inject(SettingsService);

  public readonly value: InputSignal<IGroupedRace> = input.required<IGroupedRace>();
  public readonly settings: Signal<ISettings> = this.settingsService.settings;

  protected copyStats(group: IGroupedRace) {
    const content: string = this.formatGroupStats(group);
    this.clipboard.copy(content, 'Stats copied');
  }

  private formatGroupStats(group: IGroupedRace): string {
    const { metric } = group;
    const formattedDate: string | null = this.datePipe.transform(group.timestamp, 'shortDate');

    return [
      formattedDate,
      `High score: ${metric.score.max}`,
      `Avg. score: ${metric.score.average}`,
      `Avg. solves: ${metric.solved.average}`,
      `Avg. fails: ${metric.fails.average}`,
      `High rank: ${metric.rank.min}`,
      `Avg. rank: ${metric.rank.average}`,
    ].join('\n');
  }
}
