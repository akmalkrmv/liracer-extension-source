export interface IGroupingStrategy {
  getGroupingKey(timestamp: number): string;
}
