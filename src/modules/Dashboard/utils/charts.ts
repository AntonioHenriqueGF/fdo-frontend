import type { CategoryTotalGraphPoint } from '../models/GraphModels';

export const CHART_HEIGHT = 220;

// Validated categorical order (CVD-safe for adjacent series); never cycled,
// categories past the last slot are folded into "Other"
export const CATEGORY_COLORS = [
  '#2a78d6',
  '#eb6834',
  '#1baf7a',
  '#eda100',
  '#e87ba4',
  '#008300',
  '#6250d6',
];
export const OTHER_COLOR = '#8a8984';
export const OTHER_CATEGORY_ID = '__other__';

export const POSITIVE_COLOR = '#2a78d6';
export const NEGATIVE_COLOR = '#e34948';
export const BALANCE_COLOR = '#245b8f';

// Colors bars by sign: negative values red, zero and positive values blue
export const signColorMap = {
  type: 'piecewise' as const,
  thresholds: [0],
  colors: [NEGATIVE_COLOR, POSITIVE_COLOR],
};

export const normalizeString = (...values: unknown[]) => {
  const firstValue = values.find(
    (value) =>
      value !== undefined && value !== null && String(value).trim() !== '',
  );

  return firstValue === undefined || firstValue === null
    ? ''
    : String(firstValue);
};

export const normalizeAmount = (value: unknown) => {
  const numericValue = Number(value ?? 0);

  return Number.isFinite(numericValue) ? numericValue : 0;
};

const amountFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const compactFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const formatAmount = (value: number | null | undefined) =>
  value === null || value === undefined ? '—' : amountFormatter.format(value);

export const formatCompactAmount = (value: number | null | undefined) =>
  value === null || value === undefined ? '' : compactFormatter.format(value);

export const truncateLabel = (label: string, maxLength = 14) =>
  label.length > maxLength ? `${label.slice(0, maxLength - 1)}…` : label;

/**
 * Keeps the categories with the largest absolute totals and folds the rest into "Other",
 * so a chart never needs more colors than CATEGORY_COLORS provides.
 * Returns the kept category ids in rank order plus a lookup for each one's display group.
 */
export const rankCategories = (
  totals: CategoryTotalGraphPoint[],
  maxCategories = CATEGORY_COLORS.length,
) => {
  const ranked = [...totals].sort(
    (left, right) => Math.abs(right.totalAmount) - Math.abs(left.totalAmount),
  );
  const needsOther = ranked.length > maxCategories;
  const kept = needsOther ? ranked.slice(0, maxCategories - 1) : ranked;
  const keptIds = new Set(kept.map((item) => item.categoryId));

  const groupOf = (categoryId: string) =>
    keptIds.has(categoryId) ? categoryId : OTHER_CATEGORY_ID;

  const groups = kept.map((item, index) => ({
    id: item.categoryId,
    label: item.label,
    color: CATEGORY_COLORS[index],
  }));

  if (needsOther) {
    groups.push({
      id: OTHER_CATEGORY_ID,
      label: `Other (${ranked.length - kept.length})`,
      color: OTHER_COLOR,
    });
  }

  return { groups, groupOf };
};

export type CategoryRanking = ReturnType<typeof rankCategories>;
