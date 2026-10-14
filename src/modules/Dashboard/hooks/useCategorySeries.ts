import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../../Services/ApiRequest';
import type {
  CategoryPeriodGraphPoint,
  CategoryTotalGraphPoint,
  DashboardFilters,
} from '../models/GraphModels';
import { normalizeAmount, normalizeString } from '../utils/charts';
import { toApiParams } from '../utils/period';

const normalizeCategory = (item: Record<string, unknown>, index: number) => {
  const categoryId = normalizeString(
    item.cat_id,
    item.category_id,
    item.tra_category_id,
    index + 1,
  );
  const label =
    normalizeString(
      item.cat_description,
      item.category_description,
      item.category_name,
      item.description,
    ) || `Category ${categoryId}`;

  return {
    categoryId,
    label,
    totalAmount: normalizeAmount(
      item.total_amount ?? item.total ?? item.amount,
    ),
  };
};

/**
 * Category totals for the whole range plus the same totals split by month or day.
 * Both are loaded together so the cards that use them share one category ranking (and colors).
 */
export const useCategorySeries = (filters: DashboardFilters) => {
  const { enqueueSnackbar } = useSnackbar();

  const [totals, setTotals] = useState<CategoryTotalGraphPoint[]>([]);
  const [periodRows, setPeriodRows] = useState<CategoryPeriodGraphPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const params = toApiParams(filters);
    let failed = false;

    setLoading(true);
    Promise.all([
      ApiRequest<StandardApiResponse<Record<string, unknown>[]>>({
        url: '/api/transactions/categories/total',
        method: 'GET',
        data: params,
        signal,
        callback: (response) => {
          setTotals(
            response.data.data
              .map(normalizeCategory)
              .filter((item) => item.totalAmount !== 0),
          );
        },
        errorCallback: () => {
          failed = true;
        },
      }),
      ApiRequest<StandardApiResponse<Record<string, unknown>[]>>({
        url: `/api/transactions/categories/${filters.granularity}`,
        method: 'GET',
        data: params,
        signal,
        callback: (response) => {
          setPeriodRows(
            response.data.data.map((item, index) => ({
              ...normalizeCategory(item, index),
              period: normalizeString(
                item.month,
                item.date,
                item.tra_date,
                item.day,
              ),
            })),
          );
        },
        errorCallback: () => {
          failed = true;
        },
      }),
    ]).then(() => {
      if (signal.aborted) return;
      if (failed)
        enqueueSnackbar('Error loading category totals', { variant: 'error' });
      setLoading(false);
    });

    return () => {
      abortController.abort();
    };
  }, [enqueueSnackbar, filters]);

  return { totals, periodRows, loading };
};
