import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../../Services/ApiRequest';
import type {
  BalancePoint,
  DailyBalance,
  DailyTransaction,
  DashboardFilters,
  MonthlyBalance,
  MonthlyTransaction,
} from '../models/GraphModels';
import { normalizeAmount } from '../utils/charts';

const ENDPOINTS = {
  monthly: {
    balance: '/api/balance/monthly',
    transactions: '/api/transactions/monthly',
  },
  daily: {
    balance: '/api/balance/daily',
    transactions: '/api/transactions/daily',
  },
};

// Period keys are compared as strings: yyyy-MM for monthly, yyyy-MM-dd for daily
const isInRange = (period: string, filters: DashboardFilters) => {
  const length = period.length;
  const start = filters.date_start.slice(0, length);
  const end = filters.date_end.slice(0, length);

  return (!start || period >= start) && (!end || period <= end);
};

/**
 * Closing balance and net movement per month or day.
 * The balance and transaction endpoints don't accept date filters, so the
 * range is applied here. Daily dates come as "yyyy-MM-dd 00:00:00" and are
 * trimmed to the day.
 */
export const useBalanceSeries = (filters: DashboardFilters) => {
  const { enqueueSnackbar } = useSnackbar();

  const [points, setPoints] = useState<BalancePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const endpoints = ENDPOINTS[filters.granularity];
    const balanceByPeriod = new Map<string, number>();
    const movementByPeriod = new Map<string, number>();
    let failed = false;

    setLoading(true);
    Promise.all([
      ApiRequest<StandardApiResponse<(MonthlyBalance | DailyBalance)[]>>({
        url: endpoints.balance,
        method: 'GET',
        signal,
        callback: (response) => {
          response.data.data.forEach((item) => {
            const [period, amount] =
              'month' in item
                ? [item.month, item.closing_balance]
                : [item.dba_date.slice(0, 10), item.dba_closing_balance];
            // Rows come ordered by date, so a repeated day keeps its latest balance
            balanceByPeriod.set(period, normalizeAmount(amount));
          });
        },
        errorCallback: () => {
          failed = true;
        },
      }),
      ApiRequest<
        StandardApiResponse<(MonthlyTransaction | DailyTransaction)[]>
      >({
        url: endpoints.transactions,
        method: 'GET',
        signal,
        callback: (response) => {
          response.data.data.forEach((item) => {
            const period =
              'month' in item ? item.month : item.tra_date.slice(0, 10);
            movementByPeriod.set(
              period,
              (movementByPeriod.get(period) ?? 0) +
                normalizeAmount(item.total_amount),
            );
          });
        },
        errorCallback: () => {
          failed = true;
        },
      }),
    ]).then(() => {
      if (signal.aborted) return;
      if (failed)
        enqueueSnackbar('Error loading balance data', { variant: 'error' });

      const periods = Array.from(
        new Set([...balanceByPeriod.keys(), ...movementByPeriod.keys()]),
      )
        .filter((period) => isInRange(period, filters))
        .sort((left, right) => left.localeCompare(right));

      setPoints(
        periods.map((period) => ({
          period,
          closingBalance: balanceByPeriod.get(period) ?? null,
          movement: movementByPeriod.get(period) ?? 0,
        })),
      );
      setLoading(false);
    });

    return () => {
      abortController.abort();
    };
  }, [enqueueSnackbar, filters]);

  return { points, loading };
};
