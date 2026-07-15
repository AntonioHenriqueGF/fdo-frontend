import { Alert, Box, Button } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRowSelectionModel } from '@mui/x-data-grid';
import { useMemo } from 'react';
import type { DailyBalance } from '../models/DailyBalance';

interface DailyBalancesDataGridProps {
  rows: DailyBalance[];
  loading: boolean;
  totalRows: number;
  selectedDailyBalanceId: number | null;
  paginationModel: GridPaginationModel;
  onSelectDailyBalance: (id: number | null) => void;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onCreateClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50, 100];

export const DailyBalancesDataGrid: React.FC<DailyBalancesDataGridProps> = ({
  rows,
  loading,
  totalRows,
  selectedDailyBalanceId,
  paginationModel,
  onSelectDailyBalance,
  onPaginationModelChange,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRows / paginationModel.pageSize));
  const hasSelectedDailyBalance = selectedDailyBalanceId !== null;
  const rowSelectionModel: GridRowSelectionModel = {
    type: 'include',
    ids: selectedDailyBalanceId ? new Set([selectedDailyBalanceId]) : new Set(),
  };

  const goToFirstPage = () => {
    onPaginationModelChange({ ...paginationModel, page: 0 });
  };

  const goToLastPage = () => {
    onPaginationModelChange({ ...paginationModel, page: totalPages - 1 });
  };

  const columns = useMemo<GridColDef<DailyBalance>[]>(
    () => [
      {
        field: 'dba_date',
        headerName: 'Date',
        flex: 1,
        minWidth: 220,
        sortable: false,
        valueFormatter: (value: string | undefined) => {
          return new Date(String(value)).toLocaleDateString();
        },
      },
      {
        field: 'dba_closing_balance',
        headerName: 'Closing Balance',
        flex: 1,
        minWidth: 180,
        sortable: false,
      },
    ],
    [],
  );

  if (!loading && rows.length === 0) {
    return <Alert severity="info">No daily balances found.</Alert>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
        <Button
          size="small"
          variant="contained"
          onClick={onCreateClick}
          disabled={loading}
        >
          New
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={onEditClick}
          disabled={loading || !hasSelectedDailyBalance}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={onDeleteClick}
          disabled={loading || !hasSelectedDailyBalance}
        >
          Delete
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={goToFirstPage}
          disabled={loading || paginationModel.page === 0}
        >
          First page
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={goToLastPage}
          disabled={loading || paginationModel.page >= totalPages - 1 || totalRows === 0}
        >
          Last page
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.dba_id}
        loading={loading}
        pagination
        paginationMode="server"
        rowCount={totalRows}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(selectionModel) => {
          const firstSelection = selectionModel.ids.values().next().value;
          onSelectDailyBalance(typeof firstSelection === 'number' ? firstSelection : null);
        }}
        keepNonExistentRowsSelected={false}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        sx={{
          '--DataGrid-rowWidth': '100% !important',
        }}
        disableColumnSorting
        autoHeight
      />
    </Box>
  );
};
