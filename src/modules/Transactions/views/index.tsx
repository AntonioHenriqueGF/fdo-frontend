import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid';
import { ContentPad } from '../../../shared/components/ContentPad';
import { ApiRequest, type StandardApiResponse } from '../../../Services/ApiRequest';
import type { Transaction, TransactionResponse } from '../models/TransactionResponse';
import type { Category } from '../../Categories/models/Categories';
import { TransactionsFiltersForm } from '../components/TransactionsFiltersForm';
import { TransactionsDataGrid } from '../components/TransactionsDataGrid';
import { TransactionFormModal } from '../components/TransactionFormModal';

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
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  
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

  const refetchTransactions = () => {
    setReloadKey((current) => current + 1);
  };

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
  }, [filters, paginationModel.page, paginationModel.pageSize, reloadKey]);

  const handleSearchFilter = ({
    category_id,
    date_start,
    date_end,
  }: {
    category_id: string;
    date_start: string;
    date_end: string;
  }) => {
    setSelectedTransactionId(null);
    setFilters({ category_id, date_start, date_end });
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setSelectedTransactionId(null);
    setPaginationModel(model);
  };

  const selectedTransaction = transactions.find((transaction) => transaction.tra_id === selectedTransactionId) ?? null;

  const handleCreateTransaction = (values: {
    tra_description: string;
    tra_amount: string;
    tra_date: string;
  }) => {
    setActionLoading(true);
    ApiRequest<StandardApiResponse<Transaction>>({
      url: '/api/transactions/',
      method: 'POST',
      data: values,
      callback: () => {
        enqueueSnackbar('Transaction created successfully', { variant: 'success' });
        setIsCreateModalOpen(false);
        refetchTransactions();
      },
      errorCallback: (error) => {
        enqueueSnackbar(error.response?.data?.message ?? 'Error creating transaction', { variant: 'error' });
      },
      finallyCallback: () => {
        setActionLoading(false);
      },
    });
  };

  const handleEditTransaction = (values: {
    tra_description: string;
    tra_amount: string;
    tra_date: string;
  }) => {
    if (!selectedTransactionId) return;

    setActionLoading(true);
    ApiRequest<StandardApiResponse<Transaction>>({
      url: '/api/transactions/' + (selectedTransactionId ?? ''),
      method: 'PUT',
      data: values,
      callback: () => {
        enqueueSnackbar('Transaction updated successfully', { variant: 'success' });
        setIsEditModalOpen(false);
        refetchTransactions();
      },
      errorCallback: (error) => {
        enqueueSnackbar(error.response?.data?.message ?? 'Error updating transaction', { variant: 'error' });
      },
      finallyCallback: () => {
        setActionLoading(false);
      },
    });
  };

  const handleDeleteTransaction = () => {
    if (!selectedTransaction) return;

    const shouldDelete = window.confirm('Do you really want to delete the selected transaction?');
    if (!shouldDelete) return;

    setActionLoading(true);
    ApiRequest<StandardApiResponse<null>>({
      url: '/api/transactions/' + (selectedTransactionId ?? ''),
      method: 'DELETE',
      data: {
        tra_description: selectedTransaction.tra_description,
        tra_amount: selectedTransaction.tra_amount,
        tra_date: selectedTransaction.tra_date,
      },
      callback: () => {
        enqueueSnackbar('Transaction deleted successfully', { variant: 'success' });
        setSelectedTransactionId(null);
        refetchTransactions();
      },
      errorCallback: (error) => {
        enqueueSnackbar(error.response?.data?.message ?? 'Error deleting transaction', { variant: 'error' });
      },
      finallyCallback: () => {
        setActionLoading(false);
      },
    });
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
      loading={loading || actionLoading}
      totalRows={totalTransactions}
      selectedTransactionId={selectedTransactionId}
      paginationModel={paginationModel}
      onSelectTransaction={setSelectedTransactionId}
      onPaginationModelChange={handlePaginationModelChange}
      onCreateClick={() => setIsCreateModalOpen(true)}
      onEditClick={() => setIsEditModalOpen(true)}
      onDeleteClick={handleDeleteTransaction}
    />
    <TransactionFormModal
      open={isCreateModalOpen}
      mode="create"
      loading={actionLoading}
      onClose={() => setIsCreateModalOpen(false)}
      onSubmit={handleCreateTransaction}
    />
    <TransactionFormModal
      open={isEditModalOpen}
      mode="edit"
      loading={actionLoading}
      initialValues={selectedTransaction ? {
        tra_description: selectedTransaction.tra_description,
        tra_amount: selectedTransaction.tra_amount,
        tra_date: selectedTransaction.tra_date,
      } : undefined}
      onClose={() => setIsEditModalOpen(false)}
      onSubmit={handleEditTransaction}
    />
  </ContentPad>);
};