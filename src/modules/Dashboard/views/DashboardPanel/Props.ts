import type { BarSeriesType, LineSeriesType, PieSeriesType, PieValueType, RadarSeriesType, ScatterSeriesType } from '@mui/x-charts';
import type { MakeAttrsOptional } from 'styled-components/dist/types';
import type { DailyBalance, DailyTransaction, MonthlyBalance, MonthlyTransaction } from '../../models/GraphModels';

// Define a type that represents the union of all possible series types from @mui/x-charts
type RawSeriesType = LineSeriesType | BarSeriesType | ScatterSeriesType | PieSeriesType<MakeAttrsOptional<PieValueType, 'id'>> | RadarSeriesType;

// Utilitary type to replace the 'id' property in a type T with a new type NovoId
type ReplaceId<T, NovoId> = T extends any 
  ? Omit<T, 'id' | 'yAxisId'> & { id: NovoId, yAxisId?: NovoId } 
  : never;

// Define a type that represents the union of all possible keys from the graph models
type CustomEntries = keyof DailyBalance | keyof DailyTransaction | keyof MonthlyBalance | keyof MonthlyTransaction;

type CustomSeriesType = ReplaceId<RawSeriesType, CustomEntries>;

// Define a type that represents an array of series types with the 'id' property replaced by the union of keys from the graph models, or undefined
export type SeriesType = CustomSeriesType[] | undefined;