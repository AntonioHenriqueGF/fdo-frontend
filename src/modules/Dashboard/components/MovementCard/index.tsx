import { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import type { BalancePoint, GraphGranularity } from '../../models/GraphModels';
import {
  formatAmount,
  formatCompactAmount,
  signColorMap,
} from '../../utils/charts';
import { formatPeriod } from '../../utils/period';
import { ChartCard } from '../ChartCard';

interface MovementCardProps {
  points: BalancePoint[];
  granularity: GraphGranularity;
  loading: boolean;
}

export const MovementCard: React.FC<MovementCardProps> = ({
  points,
  granularity,
  loading,
}) => {
  const netMovement = useMemo(
    () => points.reduce((sum, point) => sum + point.movement, 0),
    [points],
  );

  return (
    <ChartCard
      title="Net Transactions"
      subtitle={`Sum of transactions per ${granularity === 'monthly' ? 'month' : 'day'} · net in period`}
      headline={formatAmount(netMovement)}
      loading={loading}
      empty={points.length === 0}
    >
      <BarChart
        margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
        hideLegend
        borderRadius={4}
        grid={{ horizontal: true }}
        xAxis={[
          {
            scaleType: 'band',
            data: points.map((point) => point.period),
            valueFormatter: (value: string, context) =>
              formatPeriod(value, granularity, context.location === 'tooltip'),
          },
        ]}
        yAxis={[
          {
            width: 56,
            colorMap: signColorMap,
            valueFormatter: (value: number) => formatCompactAmount(value),
          },
        ]}
        series={[
          {
            label: 'Net transactions',
            data: points.map((point) => point.movement),
            valueFormatter: (value) => formatAmount(value),
          },
        ]}
      />
    </ChartCard>
  );
};
