import { useMemo } from 'react';
import { ContentPad } from '../../../../shared/components/ContentPad';
import { DailyReconciliation } from '../../components/DailyReconciliation';
import { DailyCategoryPanel } from '../../components/DailyCategoryPanel';

export const DashboardPanel: React.FC = () => {
  const [username] = useMemo(() => {
    return [
      JSON.parse(localStorage.getItem('user') ?? '{}').use_name ?? 'User',
    ];
  }, []);

  return (
    <ContentPad>
      <h2>
        Welcome,{' '}
        <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
          {username}
        </span>
      </h2>
      <div>
        <DailyReconciliation />
        <DailyCategoryPanel />
      </div>
    </ContentPad>
  );
};
