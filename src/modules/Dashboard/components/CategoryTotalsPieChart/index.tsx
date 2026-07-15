import { useEffect, useMemo, useState } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useSnackbar } from 'notistack';
import { ApiRequest, type StandardApiResponse } from '../../../../Services/ApiRequest';
import type { DashboardCategoryFilters } from '../../models/GraphModels';

interface CategoryTotalsPieChartProps {
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

export const CategoryTotalsPieChart: React.FC<CategoryTotalsPieChartProps> = ({ filters }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState<{ id: string; label: string; value: number; rawValue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abort = new AbortController();

    setLoading(true);
    ApiRequest<StandardApiResponse<Record<string, unknown>[]>>({
      url: '/api/transactions/categories/total',
      method: 'GET',
      data: filters,
      signal: abort.signal,
      callback: (response) => {
        const normalizedRows = response.data.data
          .map((item, index) => {
            const categoryId = normalizeString(item.cat_id, item.category_id, index + 1);
            const rawValue = normalizeAmount(item.total_amount ?? item.total ?? item.amount);
            const label = normalizeString(
              item.cat_description,
              item.category_description,
              item.category_name,
              item.description,
            ) || `Category ${categoryId}`;

            return {
              id: categoryId,
              label,
              value: Math.abs(rawValue),
              rawValue,
            };
          })
          .filter((item) => item.value > 0);

        setRows(normalizedRows);
      },
      errorCallback: (error) => {
        if (abort.signal.aborted) return;
        enqueueSnackbar(error.response?.data?.message ?? 'Error loading category totals', { variant: 'error' });
      },
      finallyCallback: () => {
        if (abort.signal.aborted) return;
        setLoading(false);
      },
    });

    return () => {
      abort.abort();
    };
  }, [enqueueSnackbar, filters]);

  const totalAmount = useMemo(() => {
    return rows.reduce((sum, row) => sum + row.rawValue, 0);
  }, [rows]);

  return (
    <Box sx={{ width: '100%' }}>
      <h3>
        Category Totals
      </h3>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={360} animation="pulse" />
      ) : rows.length === 0 ? (
        <Box sx={{ minHeight: 360, display: 'grid', placeItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography color="text.secondary">No transactions found for the selected filters.</Typography>
        </Box>
      ) : (
        <PieChart
          height={360}
          margin={{ top: 24, bottom: 24, left: 24, right: 180 }}
          series={[
            {
              data: rows,
              innerRadius: 20,
              paddingAngle: 2,
              cornerRadius: 4,
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 48, additionalRadius: -8, color: 'gray' },
              valueFormatter: (value) => {
                const rawValue = rows.find((row) => row.id === String(value.id))?.rawValue ?? value.value;

                return `${value.label}: ${rawValue.toLocaleString()}`;
              },
            },
          ]}
        />
      )}
      {!loading && rows.length > 0 ? (
        <Typography variant="body2" color="text.secondary">
          Net total in period: {totalAmount.toLocaleString()}
        </Typography>
      ) : null}
    </Box>
  );
};