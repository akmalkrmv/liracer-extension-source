import { TLineChartDataset } from '../../models';
import { ILineChartSectionDataset } from './chart-dataset-builder.interface';
import { SimpleDataset, SecondaryDataset } from './chart-dataset-builder.simple';
import { TripleDataset, TripleReverseDataset } from './chart-dataset-builder.triple';

type Ctor<T> = new (...args: any[]) => T;

function makeFactory<T extends Ctor<ILineChartSectionDataset>>(Ctor: T) {
  return (...args: ConstructorParameters<T>): TLineChartDataset[] => {
    return new Ctor(...args).build();
  };
}

export const DatasetTypes = {
  Simple: makeFactory(SimpleDataset),
  Secondary: makeFactory(SecondaryDataset),
  Triple: makeFactory(TripleDataset),
  TripleReverse: makeFactory(TripleReverseDataset),
} as const;
