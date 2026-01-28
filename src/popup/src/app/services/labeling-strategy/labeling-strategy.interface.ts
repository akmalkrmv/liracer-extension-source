export interface ILabelingStrategy {
  getTimeLabel(timestamp: number): string;
}
