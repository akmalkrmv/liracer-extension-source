export function sum(array: number[]): number {
  if (!array?.length) return 0;
  return array.reduce((sum: number, value: number) => sum + value, 0);
}

export function average(total: number, values: number[]): number {
  if (!values?.length) return 0;
  return round(total / values.length);
}

export function round(value: number, decimals: number = 2): number {
  return parseFloat(value.toFixed(decimals));
}
