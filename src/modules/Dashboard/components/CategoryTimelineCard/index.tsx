import { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import type {
  CategoryPeriodGraphPoint,
  GraphGranularity,
} from '../../models/GraphModels';
import {
  formatAmount,
  formatCompactAmount,
  type CategoryRanking,
} from '../../utils/charts';
import { formatPeriod } from '../../utils/period';
import { ChartCard } from '../ChartCard';

interface CategoryTimelineCardProps {
  rows: CategoryPeriodGraphPoint[];
  ranking: CategoryRanking;
  granularity: GraphGranularity;
  loading: boolean;
}

export const CategoryTimelineCard: React.FC<CategoryTimelineCardProps> = ({
  rows,
  ranking,
  granularity,
  loading,
}) => {
  const chartData = useMemo(() => {
    const periods = Array.from(new Set(rows.map((row) => row.period))).sort(
      (left, right) => left.localeCompare(right),
    );
    const totals = new Map<string, number>();

    rows.forEach((row) => {
      const key = `${row.period}|${ranking.groupOf(row.categoryId)}`;
      totals.set(key, (totals.get(key) ?? 0) + row.totalAmount);
    });

    const series = ranking.groups.map((group) => ({
      id: group.id,
      label: group.label,
      color: group.color,
      stack: 'total',
      stackOffset: 'diverging' as const,
      data: periods.map((period) => totals.get(`${period}|${group.id}`) ?? 0),
      valueFormatter: (value: number | null) =>
        value ? formatAmount(value) : null,
    }));

    return { periods, series };
  }, [rows, ranking]);

  return (
    <ChartCard
      title={`Categories by ${granularity === 'monthly' ? 'Month' : 'Day'}`}
      subtitle="Income above zero, expenses below"
      loading={loading}
      empty={chartData.series.length === 0}
    >
      <BarChart
        margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
        borderRadius={4}
        grid={{ horizontal: true }}
        slotProps={{
          legend: {
            position: { vertical: 'top', horizontal: 'start' },
            sx: { fontSize: 11, gap: 1, rowGap: 0.5 },
          },
        }}
        xAxis={[
          {
            scaleType: 'band',
            data: chartData.periods,
            valueFormatter: (value: string, context) =>
              formatPeriod(value, granularity, context.location === 'tooltip'),
          },
        ]}
        yAxis={[
          {
            width: 56,
            valueFormatter: (value: number) => formatCompactAmount(value),
          },
        ]}
        series={chartData.series}
      />
    </ChartCard>
  );
};
