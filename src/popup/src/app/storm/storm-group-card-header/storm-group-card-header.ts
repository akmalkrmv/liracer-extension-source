import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IGroupedStorm } from '../../models/grouped-storm.model';
import { TrainButton } from '../../actions/train-button/train-button';
import { ISettings } from '@extension/shared/models';
import { SettingsService } from '../../services/settings.service';
import { ClipboardService } from '../../services/clipboard.service';

@Component({
  selector: 'app-storm-group-card-header',
  imports: [DatePipe, TrainButton],
  templateUrl: './storm-group-card-header.html',
  styles: ``,
})
export class StormGroupCardHeader {
  private readonly datePipe: DatePipe = inject(DatePipe);
  private readonly clipboard: ClipboardService = inject(ClipboardService);
  private readonly settingsService: SettingsService = inject(SettingsService);

  public readonly value: InputSignal<IGroupedStorm> = input.required<IGroupedStorm>();
  public readonly settings: Signal<ISettings> = this.settingsService.settings;

  protected copyStats(group: IGroupedStorm) {
    const content: string = this.formatGroupStats(group);
    this.clipboard.copy(content, 'Stats copied');
  }

  private formatGroupStats(group: IGroupedStorm): string {
    const { metric } = group;
    const formattedDate: string | null = this.datePipe.transform(group.timestamp, 'shortDate');

    return [
      formattedDate,
      `High score: ${metric.score.max}`,
      `Avg. score: ${metric.score.average}`,
      `Avg. solves: ${metric.solved.average}`,
      `Avg. fails: ${metric.fails.average}`,
      `High solved puzzle rating: ${metric.highestSolved.max}`,
      `Avg. solved puzzle rating: ${metric.highestSolved.average}`,
    ].join('\n');
  }
}
