import { useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import type { BalancePoint, GraphGranularity } from '../../models/GraphModels';
import {
  BALANCE_COLOR,
  formatAmount,
  formatCompactAmount,
} from '../../utils/charts';
import { formatPeriod } from '../../utils/period';
import { ChartCard } from '../ChartCard';

interface BalanceCardProps {
  points: BalancePoint[];
  granularity: GraphGranularity;
  loading: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  points,
  granularity,
  loading,
}) => {
  const latestBalance = useMemo(() => {
    return (
      [...points].reverse().find((point) => point.closingBalance !== null)
        ?.closingBalance ?? null
    );
  }, [points]);

  return (
    <ChartCard
      title="Closing Balance"
      subtitle={
        granularity === 'monthly'
          ? 'Balance at the end of each month'
          : 'Balance at the end of each day'
      }
      headline={formatAmount(latestBalance)}
      loading={loading}
      empty={latestBalance === null}
    >
      <LineChart
        margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
        hideLegend
        grid={{ horizontal: true }}
        xAxis={[
          {
            scaleType: 'point',
            data: points.map((point) => point.period),
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
        series={[
          {
            label: 'Closing balance',
            data: points.map((point) => point.closingBalance),
            color: BALANCE_COLOR,
            connectNulls: true,
            showMark: points.length <= 1,
            valueFormatter: (value) => formatAmount(value),
          },
        ]}
      />
    </ChartCard>
  );
};
