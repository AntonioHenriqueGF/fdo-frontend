import { format, startOfMonth, subMonths, subYears } from 'date-fns';
import type {
  DashboardFilters,
  GraphGranularity,
  PeriodPreset,
} from '../models/GraphModels';

export const PERIOD_PRESETS: PeriodPreset[] = [
  '1M',
  '3M',
  '6M',
  '1Y',
  '2Y',
  'ALL',
];

export const DEFAULT_PRESET: Record<GraphGranularity, PeriodPreset> = {
  monthly: '1Y',
  daily: '1M',
};

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

const PRESET_MONTHS: Record<Exclude<PeriodPreset, 'ALL'>, number> = {
  '1M': 1,
  '3M': 3,
  '6M': 6,
  '1Y': 12,
  '2Y': 24,
};

export const getPresetRange = (
  preset: PeriodPreset,
  granularity: GraphGranularity,
) => {
  const today = new Date();

  if (preset === 'ALL') {
    return { date_start: '', date_end: formatDate(today) };
  }

  const months = PRESET_MONTHS[preset];
  // Monthly ranges start at the beginning of a month so the first bucket is complete,
  // e.g. 1Y = the current month plus the 11 before it
  const start =
    granularity === 'monthly'
      ? startOfMonth(subMonths(today, months - 1))
      : months % 12 === 0
        ? subYears(today, months / 12)
        : subMonths(today, months);

  return { date_start: formatDate(start), date_end: formatDate(today) };
};

export const buildDefaultFilters = (
  granularity: GraphGranularity,
): DashboardFilters => ({
  granularity,
  preset: DEFAULT_PRESET[granularity],
  category_id: [],
  ...getPresetRange(DEFAULT_PRESET[granularity], granularity),
});

// Omits empty values so unbounded ranges are not sent to the API
export const toApiParams = (
  filters: DashboardFilters,
  includeCategories = true,
) => {
  const params: Record<string, string | string[]> = {};

  if (filters.date_start) params.date_start = filters.date_start;
  if (filters.date_end) params.date_end = filters.date_end;
  if (includeCategories && filters.category_id.length > 0)
    params.category_id = filters.category_id;

  return params;
};

const parsePeriod = (period: string) =>
  new Date(
    period.length === 7 ? `${period}-01T00:00:00` : `${period}T00:00:00`,
  );

export const formatPeriod = (
  period: string,
  granularity: GraphGranularity,
  long = false,
) => {
  const date = parsePeriod(period);

  if (Number.isNaN(date.getTime())) return period;

  if (granularity === 'monthly') {
    return date.toLocaleDateString(undefined, {
      month: long ? 'long' : 'short',
      year: long ? 'numeric' : '2-digit',
    });
  }

  return long
    ? date.toLocaleDateString()
    : date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
};
