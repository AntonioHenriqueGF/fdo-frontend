import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid';
import { ContentPad } from '../../../shared/components/ContentPad';
import { ApiRequest, type StandardApiResponse } from '../../../Services/ApiRequest';
import { DailyBalancesFiltersForm } from '../components/DailyBalancesFiltersForm';
import { DailyBalanceFormModal } from '../components/DailyBalanceFormModal';
import { DailyBalancesDataGrid } from '../components/DailyBalancesDataGrid';
import type { DailyBalance, DailyBalanceResponse } from '../models/DailyBalance';

export const DailyBalancesView: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [dailyBalances, setDailyBalances] = useState<DailyBalance[]>([]);
  const [totalDailyBalances, setTotalDailyBalances] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<{
    date_start: string;
    date_end: string;
  }>({
    date_start: '',
    date_end: '',
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [selectedDailyBalanceId, setSelectedDailyBalanceId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const refetchDailyBalances = () => {
    setReloadKey((current) => current + 1);
  };

  useEffect(() => {
    const abort = new AbortController();
    const limitStart = paginationModel.page * paginationModel.pageSize;
    const limitEnd = paginationModel.pageSize;

    setLoading(true);
    ApiRequest<StandardApiResponse<DailyBalanceResponse>>({
      url: '/api/daily-balances',
      method: 'GET',
      signal: abort.signal,
      data: {
        ...filters,
        limitStart,
        limitEnd,
      },
      callback: (response) => {
        setDailyBalances(response.data.data.rows);
        setTotalDailyBalances(response.data.data.total);
      },
      errorCallback: (error) => {
        if (abort.signal.aborted) return; // Don't show error if the request was aborted
        enqueueSnackbar(error.response?.data?.message ?? 'Error loading daily balances', { variant: 'error' });
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
    date_start,
    date_end,
  }: {
    date_start: string;
    date_end: string;
  }) => {
    setSelectedDailyBalanceId(null);
    setFilters({ date_start, date_end });
    setPaginationModel((current) => ({ ...current, page: 0 }));
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setSelectedDailyBalanceId(null);
    setPaginationModel(model);
  };

  const selectedDailyBalance = dailyBalances?.find((dailyBalance) => dailyBalance.dba_id === selectedDailyBalanceId) ?? null;

  const handleCreateDailyBalance = (values: {
    dba_closing_balance: string;
    dba_date: string;
  }) => {
    setActionLoading(true);
    ApiRequest<StandardApiResponse<DailyBalance>>({
      url: '/api/daily-balances/',
      method: 'POST',
      data: values,
      callback: () => {
        enqueueSnackbar('Daily balance created successfully', { variant: 'success' });
        setIsCreateModalOpen(false);
        refetchDailyBalances();
      },
      errorCallback: (error) => {
        enqueueSnackbar(error.response?.data?.message ?? 'Error creating daily balance', { variant: 'error' });
      },
      finallyCallback: () => {
        setActionLoading(false);
      },
    });
  };

  const handleEditDailyBalance = (values: {
    dba_closing_balance: string;
    dba_date: string;
  }) => {
    if (!selectedDailyBalance) return;

    setActionLoading(true);
    ApiRequest<StandardApiResponse<DailyBalance>>({
      url: '/api/daily-balances/' + (selectedDailyBalanceId ?? ''),
      method: 'PUT',
      data: values,
      callback: () => {
        enqueueSnackbar('Daily balance updated successfully', { variant: 'success' });
        setIsEditModalOpen(false);
        refetchDailyBalances();
      },
      errorCallback: (error) => {
        enqueueSnackbar(error.response?.data?.message ?? 'Error updating daily balance', { variant: 'error' });
      },
      finallyCallback: () => {
        setActionLoading(false);
      },
    });
  };

  const handleDeleteDailyBalance = () => {
    if (!selectedDailyBalance) return;

    const shouldDelete = window.confirm('Do you really want to delete the selected daily balance?');
    if (!shouldDelete) return;

    setActionLoading(true);
    ApiRequest<StandardApiResponse<null>>({
      url: '/api/daily-balances/' + (selectedDailyBalanceId ?? ''),
      method: 'DELETE',
      data: {
        dba_closing_balance: selectedDailyBalance.dba_closing_balance,
        dba_date: selectedDailyBalance.dba_date,
      },
      callback: () => {
        enqueueSnackbar('Daily balance deleted successfully', { variant: 'success' });
        setSelectedDailyBalanceId(null);
        refetchDailyBalances();
      },
      errorCallback: (error) => {
        enqueueSnackbar(error.response?.data?.message ?? 'Error deleting daily balance', { variant: 'error' });
      },
      finallyCallback: () => {
        setActionLoading(false);
      },
    });
  };

  return (<ContentPad>
    <h2>Daily Balances</h2>
    <DailyBalancesFiltersForm
      onSubmit={handleSearchFilter}
    />
    <DailyBalancesDataGrid
      rows={dailyBalances}
      loading={loading || actionLoading}
      totalRows={totalDailyBalances}
      selectedDailyBalanceId={selectedDailyBalanceId}
      paginationModel={paginationModel}
      onSelectDailyBalance={setSelectedDailyBalanceId}
      onPaginationModelChange={handlePaginationModelChange}
      onCreateClick={() => setIsCreateModalOpen(true)}
      onEditClick={() => setIsEditModalOpen(true)}
      onDeleteClick={handleDeleteDailyBalance}
    />
    <DailyBalanceFormModal
      open={isCreateModalOpen}
      mode="create"
      loading={actionLoading}
      onClose={() => setIsCreateModalOpen(false)}
      onSubmit={handleCreateDailyBalance}
    />
    <DailyBalanceFormModal
      open={isEditModalOpen}
      mode="edit"
      loading={actionLoading}
      initialValues={selectedDailyBalance ? {
        dba_closing_balance: selectedDailyBalance.dba_closing_balance,
        dba_date: selectedDailyBalance.dba_date,
      } : undefined}
      onClose={() => setIsEditModalOpen(false)}
      onSubmit={handleEditDailyBalance}
    />
  </ContentPad>);
};