import { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import type { CategoryTotalGraphPoint } from '../../models/GraphModels';
import {
  formatAmount,
  formatCompactAmount,
  signColorMap,
  truncateLabel,
  type CategoryRanking,
} from '../../utils/charts';
import { ChartCard } from '../ChartCard';

interface CategoryTotalsCardProps {
  totals: CategoryTotalGraphPoint[];
  ranking: CategoryRanking;
  loading: boolean;
}

export const CategoryTotalsCard: React.FC<CategoryTotalsCardProps> = ({
  totals,
  ranking,
  loading,
}) => {
  const bars = useMemo(() => {
    const totalsByGroup = new Map<string, number>();

    totals.forEach((item) => {
      const groupId = ranking.groupOf(item.categoryId);
      totalsByGroup.set(
        groupId,
        (totalsByGroup.get(groupId) ?? 0) + item.totalAmount,
      );
    });

    return ranking.groups.map((group) => ({
      label: group.label,
      value: totalsByGroup.get(group.id) ?? 0,
    }));
  }, [totals, ranking]);

  const netTotal = useMemo(
    () => totals.reduce((sum, item) => sum + item.totalAmount, 0),
    [totals],
  );

  return (
    <ChartCard
      title="Totals by Category"
      subtitle="Largest categories in the period · net total"
      headline={formatAmount(netTotal)}
      loading={loading}
      empty={bars.length === 0}
    >
      <BarChart
        layout="horizontal"
        margin={{ top: 8, right: 24, bottom: 0, left: 0 }}
        hideLegend
        borderRadius={4}
        grid={{ vertical: true }}
        yAxis={[
          {
            scaleType: 'band',
            width: 104,
            data: bars.map((bar) => bar.label),
            valueFormatter: (value: string, context) =>
              context.location === 'tick' ? truncateLabel(value) : value,
          },
        ]}
        xAxis={[
          {
            colorMap: signColorMap,
            tickNumber: 4,
            valueFormatter: (value: number) => formatCompactAmount(value),
          },
        ]}
        series={[
          {
            label: 'Total',
            data: bars.map((bar) => bar.value),
            valueFormatter: (value) => formatAmount(value),
          },
        ]}
      />
    </ChartCard>
  );
};
