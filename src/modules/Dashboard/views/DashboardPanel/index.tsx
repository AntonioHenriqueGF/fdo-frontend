import { useEffect, useMemo, useState } from 'react';
import { ContentPad } from '../../../../shared/components/ContentPad';
import { ApiRequest, type StandardApiResponse } from '../../../../Services/ApiRequest';
import { useSnackbar } from 'notistack';
import type { MonthlyBalance, MonthlyTransaction } from '../../models/GraphModels';

import { DailyGraph } from '../../components/DailyGraph';

export const DashboardPanel: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [, setMonthlyBalances] = useState<MonthlyBalance[]>([]);
  const [, setMonthlyTransactions] = useState<MonthlyTransaction[]>([]);

  useEffect(() => {
    ApiRequest<StandardApiResponse<MonthlyBalance[]>>({
      url: '/api/balance/monthly',
      method: 'GET',
      callback: (response) => {
        setMonthlyBalances(response.data.data);
      },
      errorCallback: () => {
        enqueueSnackbar('Error requesting monthly balance', { variant: 'error' });
      },
    });
    ApiRequest<StandardApiResponse<MonthlyTransaction[]>>({
      url: '/api/transactions/monthly',
      method: 'GET',
      callback: (response) => {
        setMonthlyTransactions(response.data.data);
      },
      errorCallback: () => {
        enqueueSnackbar('Error requesting monthly transactions', { variant: 'error' });
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [username] = useMemo(() => {
    return [JSON.parse(localStorage.getItem('user') ?? '{}').use_name ?? 'User'];
  }, []);

  return (
    <ContentPad>
      <h2>Welcome, <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{username}</span></h2>
      <DailyGraph />
    </ContentPad>
  );
};