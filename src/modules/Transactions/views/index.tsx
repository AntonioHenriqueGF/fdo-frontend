import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid';
import { ContentPad } from '../../../shared/components/ContentPad';
import { ApiRequest, type StandardApiResponse } from '../../../Services/ApiRequest';
import type { Transaction, TransactionResponse } from '../models/TransactionResponse';
import type { Category } from '../../Categories/models/Categories';
import { TransactionsFiltersForm } from '../components/TransactionsFiltersForm';
import { TransactionsDataGrid } from '../components/TransactionsDataGrid';

export const TransactionsView: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<{
    category_id: string;
    date_start: string;
    date_end: string;
  }>({
    category_id: '',
    date_start: '',
    date_end: '',
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  
  useEffect(() => {
    const abort = new AbortController();
    // Fetch categories from the backend when the component mounts
    setLoadingCategories(true);
    ApiRequest<StandardApiResponse<Category[]>>({
      url: '/api/categories',
      method: 'GET',
      signal: abort.signal,
      callback: (response) => {
        setCategories(response.data.data);
      },
      errorCallback: () => {
        if (abort.signal.aborted) return; // Don't show error if the request was aborted
        enqueueSnackbar('Error loading categories', { variant: 'error' });
      },
      finallyCallback: () => {
        if (abort.signal.aborted) return;
        setLoadingCategories(false);
      },
    });
    return () => {
      abort.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const abort = new AbortController();
    const limitStart = paginationModel.page * paginationModel.pageSize;
    const limitEnd = paginationModel.pageSize;

    setLoading(true);
    ApiRequest<StandardApiResponse<TransactionResponse>>({
      url: '/api/transactions',
      method: 'GET',
      signal: abort.signal,
      data: {
        ...filters,
        limitStart,
        limitEnd,
      },
      callback: (response) => {
        setTransactions(response.data.data.rows);
        setTotalTransactions(response.data.data.total);
      },
      errorCallback: (error) => {
        if (abort.signal.aborted) return; // Don't show error if the request was aborted
        enqueueSnackbar(error.response?.data?.message ?? 'Error loading transactions', { variant: 'error' });
      },
      finallyCallback: () => {
        if (abort.signal.aborted) return;
        setLoading(false);
      },
    });

    return () => {
      abort.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, paginationModel.page, paginationModel.pageSize]);

  const handleSearchFilter = ({
    category_id,
    date_start,
    date_end,
  }: {
    category_id: string;
    date_start: string;
    date_end: string;
  }) => {
    setFilters({ category_id, date_start, date_end });
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  return (<ContentPad>
    <h2>Transactions</h2>
    <TransactionsFiltersForm
      categories={categories}
      loadingCategories={loadingCategories}
      onSubmit={handleSearchFilter}
    />
    <TransactionsDataGrid
      rows={transactions}
      loading={loading}
      totalRows={totalTransactions}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
    />
  </ContentPad>);
};