import { Component, ElementRef, inject, input, InputSignal, ViewChild } from '@angular/core';
import { ISettings } from '@extension/shared/models';
import { SettingsService } from '../services/settings.service';
import { ILineChartData, TLineChartScalesOptions } from './models';
import { CHART_COLORS } from './consts';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
  ChartDataset,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
);

@Component({
  selector: 'app-line-chart',
  imports: [],
  template: `<canvas #canvas></canvas>`,
  styles: `
    canvas {
      width: 100%;
    }
  `,
})
export class LineChart {
  public readonly data: InputSignal<ILineChartData> = input.required();

  @ViewChild('canvas', { static: true })
  private readonly canvas!: ElementRef<HTMLCanvasElement>;

  private readonly settingsService: SettingsService = inject(SettingsService);
  private theme: string = 'dark';

  async ngAfterViewInit(): Promise<void> {
    const settings: ISettings = await this.settingsService.getSettings();
    this.theme = settings.theme;

    const { labels, datasets } = this.data();
    this.createChart(this.canvas.nativeElement, labels, datasets);
  }

  private createChart(
    canvas: HTMLCanvasElement,
    labels: string[],
    datasets: ChartDataset<'line', number[]>[],
  ) {
    const isDark: boolean = this.theme === 'dark';
    const textColor: string | undefined = isDark ? CHART_COLORS.textMuted : undefined;
    const scales: TLineChartScalesOptions = this.getThemedScales(textColor);

    return new Chart(canvas, {
      type: 'line',
      data: { labels, datasets },
      options: {
        scales,
        responsive: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { position: 'top', labels: { color: textColor } },
          title: { display: true, text: 'Line Chart' },
        },
      },
    });
  }

  private getThemedScales(textColor: string | undefined): TLineChartScalesOptions {
    // Use chart.js' default theme if its light theme
    if (this.theme === 'light') return undefined;

    return {
      x: {
        grid: { color: CHART_COLORS.grid },
        ticks: { color: textColor },
      },
      y: {
        grid: { color: CHART_COLORS.grid },
        ticks: { color: textColor },
      },
    };
  }
}
