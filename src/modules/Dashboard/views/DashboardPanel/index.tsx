import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ContentPad } from '../../../../shared/components/ContentPad';
import { DashboardFiltersAtom } from '../../atoms/DashboardFiltersAtoms';
import { useBalanceSeries } from '../../hooks/useBalanceSeries';
import { useCategorySeries } from '../../hooks/useCategorySeries';
import { rankCategories } from '../../utils/charts';
import { DashboardToolbar } from '../../components/DashboardToolbar';
import { BalanceCard } from '../../components/BalanceCard';
import { MovementCard } from '../../components/MovementCard';
import { CategoryTimelineCard } from '../../components/CategoryTimelineCard';
import { CategoryTotalsCard } from '../../components/CategoryTotalsCard';
import { DashboardGrid } from './styles';

export const DashboardPanel: React.FC = () => {
  const [username] = useMemo(() => {
    return [
      JSON.parse(localStorage.getItem('user') ?? '{}').use_name ?? 'User',
    ];
  }, []);

  const filters = useAtomValue(DashboardFiltersAtom);
  const balance = useBalanceSeries(filters);
  const categories = useCategorySeries(filters);

  // Shared by both category cards so a category keeps the same color in each
  const ranking = useMemo(
    () => rankCategories(categories.totals),
    [categories.totals],
  );

  return (
    <ContentPad>
      <h2>
        Welcome,{' '}
        <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
          {username}
        </span>
      </h2>
      <DashboardToolbar />
      <DashboardGrid>
        <BalanceCard
          points={balance.points}
          granularity={filters.granularity}
          loading={balance.loading}
        />
        <MovementCard
          points={balance.points}
          granularity={filters.granularity}
          loading={balance.loading}
        />
        <CategoryTimelineCard
          rows={categories.periodRows}
          ranking={ranking}
          granularity={filters.granularity}
          loading={categories.loading}
        />
        <CategoryTotalsCard
          totals={categories.totals}
          ranking={ranking}
          loading={categories.loading}
        />
      </DashboardGrid>
    </ContentPad>
  );
};
