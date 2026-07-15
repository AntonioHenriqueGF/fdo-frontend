import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Skeleton, Typography } from '@mui/material';
import type { CategoryDailyGraphPoint, DashboardCategoryFilters } from '../../models/GraphModels';

import { ApiRequest, type StandardApiResponse } from '../../../../Services/ApiRequest';
import { BarChart } from '@mui/x-charts';

interface DailyGraphProps {
  filters: DashboardCategoryFilters;
}

const normalizeString = (...values: unknown[]) => {
  const firstValue = values.find((value) => value !== undefined && value !== null && String(value).trim() !== '');

  return firstValue === undefined || firstValue === null ? '' : String(firstValue);
};

const normalizeAmount = (value: unknown) => {
  const numericValue = Number(value ?? 0);

  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const DailyGraph: React.FC<DailyGraphProps> = ({ filters }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [rows, setRows] = useState<CategoryDailyGraphPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    setLoading(true);
    ApiRequest<StandardApiResponse<Record<string, unknown>[]>>({
      url: '/api/transactions/categories/daily',
      method: 'GET',
      data: filters,
      signal: abortController.signal,
      callback: (response) => {
        const normalizedRows = response.data.data.map((item, index) => {
          const categoryId = normalizeString(item.cat_id, item.category_id, item.tra_category_id, index + 1);

          return {
            date: normalizeString(item.tra_date, item.date, item.day),
            categoryId,
            label: normalizeString(
              item.cat_description,
              item.category_description,
              item.category_name,
              item.description,
            ) || `Category ${categoryId}`,
            totalAmount: normalizeAmount(item.total_amount ?? item.total ?? item.amount),
          };
        });

        setRows(normalizedRows);
      },
      errorCallback: (error) => {
        if (abortController.signal.aborted) return;
        enqueueSnackbar(error.response?.data?.message ?? 'Error loading category daily totals', { variant: 'error' });
      },
      finallyCallback: () => {
        if (abortController.signal.aborted) return;
        setLoading(false);
      },
    });
    return () => {
      abortController.abort();
    };
  }, [enqueueSnackbar, filters]);

  const chartData = useMemo(() => {
    const dates = Array.from(new Set(rows.map((row) => row.date))).sort((left, right) => left.localeCompare(right));
    const categoryMap = new Map<string, string>();
    const totalsByDateAndCategory = new Map<string, number>();

    rows.forEach((row) => {
      categoryMap.set(row.categoryId, row.label);
      totalsByDateAndCategory.set(`${row.date}-${row.categoryId}`, row.totalAmount);
    });

    const series = Array.from(categoryMap.entries()).map(([categoryId, label]) => ({
      id: categoryId,
      label,
      data: dates.map((date) => totalsByDateAndCategory.get(`${date}-${categoryId}`) ?? 0),
      showMark: false,
      area: false,
    }));

    return { dates, series };
  }, [rows]);

  return (
    <Box sx={{ width: '100%' }}>
      <h3>
        Daily Totals By Category
      </h3>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={400} animation="pulse" />
      ) : chartData.series.length === 0 ? (
        <Box sx={{ minHeight: 400, display: 'grid', placeItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography color="text.secondary">No daily data found for the selected filters.</Typography>
        </Box>
      ) : (
        <BarChart
          height={400}
          margin={{ top: 24, right: 24, bottom: 48, left: 56 }}
          xAxis={[
            {
              id: 'date',
              scaleType: 'band',
              data: chartData.dates,
              valueFormatter: (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString(),
            },
          ]}
          series={chartData.series}
          yAxis={[{ label: 'Amount' }]}
        />
      )}
    </Box>
  );
};