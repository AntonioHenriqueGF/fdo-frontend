import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Box } from '@mui/material';
import type { DailyBalance, DailyTransaction, ReconciliationDailyData } from '../../models/GraphModels';

import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { BarPlot, ChartsAxisHighlight, ChartsTooltip, ChartsXAxis, ChartsYAxis, LineHighlightPlot, LinePlot } from '@mui/x-charts';
import { ApiRequest, type StandardApiResponse } from '../../../../Services/ApiRequest';
import type { SeriesType } from '../../views/DashboardPanel/Props';
import { Loading } from '../../../../shared/components/Loading';
import { IntervalButton, IntervalSelectorWrapper } from './styles';

interface IntervalObject {
  date_start?: Date
  date_end?: Date
}

export const DailyGraph: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [dailyBalances, setDailyBalances] = useState<DailyBalance[]>([]);
  const [dailyTransactions, setDailyTransactions] = useState<DailyTransaction[]>([]);
  const [interval, setInterval] = useState<IntervalObject>({
    date_start: new Date(new Date().setDate(new Date().getDate() - 30)),
    date_end: new Date(),
  });
  const [selectedInterval, setSelectedInterval] = useState<string>('1M');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Loading: ', loading);
  }, [loading]);

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);
    ApiRequest<StandardApiResponse<ReconciliationDailyData[]>>({
      url: '/api/transactions/reconciliation/daily',
      method: 'POST',
      data: {
        date_start: interval.date_start?.toISOString().split('T')[0],
        date_end: interval.date_end?.toISOString().split('T')[0],
      },
      signal: abortController.signal,
      callback: (response) => {
        const data = response.data.data;
        const balances: DailyBalance[] = data.map((item) => ({
          dba_date: item.tra_date,
          dba_closing_balance: item.dba_closing_balance,
        }));
        const transactions: DailyTransaction[] = data.map((item) => ({
          tra_date: item.tra_date,
          total_amount: item.total_amount,
        }));
        setDailyBalances(balances);
        setDailyTransactions(transactions);
      },
      errorCallback: () => {
        if (abortController.signal.aborted) return;
        enqueueSnackbar('Error requesting daily data', { variant: 'error' });
      },
      finallyCallback: () => {
        if (abortController.signal.aborted) return;
        setLoading(false);
      },
    });
    return () => {
      abortController.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
    const now = new Date();
    let dateStart: Date | undefined;
    switch (interval) {
      case 'EVER':
        dateStart = undefined;
        break;
      case '2Y':
        dateStart = new Date(now.setFullYear(now.getFullYear() - 2));
        break;
      case '1Y':
        dateStart = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case '6M':
        dateStart = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '3M':
        dateStart = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '1M':
      default:
        dateStart = new Date(now.setMonth(now.getMonth() - 1));
        break;
    }
    setInterval({ date_start: dateStart, date_end: new Date() });
  };

  const seriesWithValues = useMemo(() => {
    return [
      {
        type: 'bar',
        id: 'dba_closing_balance',
        yAxisId: 'dba_closing_balance',
        label: 'Daily Balance',
        highlightScope: { highlight: 'item' },
        data: dailyBalances.map((balance) => Number(balance.dba_closing_balance)),
      },
      {
        type: 'line',
        id: 'total_amount',
        yAxisId: 'total_amount',
        label: 'Daily Transactions',
        color: '#e7713a',
        highlightScope: { highlight: 'item' },
        data: dailyTransactions.map((transaction) => Number(transaction.total_amount)),
      },
    ] as SeriesType;
  }, [dailyBalances, dailyTransactions]);

  return (
    <Box sx={{ width: '100%', height: 400, marginTop: 4 }}>
      <h3>Daily Balance and Transactions</h3>
      <IntervalSelectorWrapper>
        <IntervalButton active={selectedInterval === 'EVER'} onClick={() => handleIntervalChange('EVER')}>EVER</IntervalButton>
        <IntervalButton active={selectedInterval === '2Y'} onClick={() => handleIntervalChange('2Y')}>2Y</IntervalButton>
        <IntervalButton active={selectedInterval === '1Y'} onClick={() => handleIntervalChange('1Y')}>1Y</IntervalButton>
        <IntervalButton active={selectedInterval === '6M'} onClick={() => handleIntervalChange('6M')}>6M</IntervalButton>
        <IntervalButton active={selectedInterval === '3M'} onClick={() => handleIntervalChange('3M')}>3M</IntervalButton>
        <IntervalButton active={selectedInterval === '1M'} onClick={() => handleIntervalChange('1M')}>1M</IntervalButton>
      </IntervalSelectorWrapper>
      {loading ? (
        <Loading />
      ) : (
        <ChartsContainer series={seriesWithValues}
          xAxis={[
            {
              id: 'date',
              data: dailyBalances.map((balance) => new Date(balance.dba_date)),
              scaleType: 'band',
              valueFormatter: (value: Date) => value.toLocaleDateString(),
              height: 48,
            },
          ]}
          yAxis={[
            { id: 'total_amount', scaleType: 'linear', position: 'left', width: 100 },
            {
              id: 'dba_closing_balance',
              scaleType: 'linear',
              position: 'right',
              width: 100,
            },
          ]}>
          <ChartsAxisHighlight x="line" />
          <BarPlot />
          <LinePlot />

          <LineHighlightPlot />
          <ChartsXAxis
            label="Date"
            axisId="date"
            tickInterval={(_value, index) => {
              const amountOfDataPoints = dailyBalances.length;
              if (amountOfDataPoints <= 30) {
                return true; // Show all ticks if there are 30 or fewer data points
              }
              if (amountOfDataPoints <= 90) {
                return index % 3 === 0; // Show every 3rd tick if there are between 31 and 90 data points
              }
              return index % 30 === 0;
            }}
            tickLabelStyle={{
              fontSize: 10,
            }}
          />
          <ChartsYAxis
            label="Daily Balance"
            axisId="dba_closing_balance"
            tickLabelStyle={{ fontSize: 10 }}
          />
          <ChartsYAxis
            label="Daily Transactions"
            axisId="total_amount"
            tickLabelStyle={{ fontSize: 10 }}
          />
          <ChartsTooltip />
        </ChartsContainer>
      )}
    </Box>
  );
};