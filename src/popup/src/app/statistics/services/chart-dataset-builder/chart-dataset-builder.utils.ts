import { TLineChartDataset } from '../../models';

export function createDataset(
  label: string,
  data: number[],
  color: string,
  dashed = false,
): TLineChartDataset {
  return {
    label,
    data,
    pointRadius: 1,
    borderWidth: 2,
    borderColor: color, // Color of the line
    backgroundColor: color, // Color of the points
    ...(dashed && { borderDash: () => [4, 4] }),
  };
}
