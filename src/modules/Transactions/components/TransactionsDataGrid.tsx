import { Alert, Box, Button } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { useMemo } from 'react';
import type { Transaction } from '../models/TransactionResponse';

interface TransactionsDataGridProps {
  rows: Transaction[];
  loading: boolean;
  totalRows: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50, 100];

export const TransactionsDataGrid: React.FC<TransactionsDataGridProps> = ({
  rows,
  loading,
  totalRows,
  paginationModel,
  onPaginationModelChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRows / paginationModel.pageSize));

  const goToFirstPage = () => {
    onPaginationModelChange({ ...paginationModel, page: 0 });
  };

  const goToLastPage = () => {
    onPaginationModelChange({ ...paginationModel, page: totalPages - 1 });
  };

  const columns = useMemo<GridColDef<Transaction>[]>(
    () => [
      {
        field: 'tra_description',
        headerName: 'Description',
        flex: 1.5,
        minWidth: 220,
        sortable: false,
      },
      {
        field: 'cat_description',
        headerName: 'Category',
        flex: 1,
        minWidth: 180,
        sortable: false,
      },
      {
        field: 'tra_amount',
        headerName: 'Amount',
        flex: 0.8,
        minWidth: 140,
        sortable: false,
      },
      {
        field: 'tra_date',
        headerName: 'Date',
        flex: 0.8,
        minWidth: 140,
        sortable: false,
        valueFormatter: (value: string | undefined) => {
          return new Date(String(value)).toLocaleDateString();
        },
      },
    ],
    [],
  );

  if (!loading && rows.length === 0) {
    return <Alert severity="info">No transactions found.</Alert>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
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
        getRowId={(row) => row.tra_id}
        loading={loading}
        pagination
        paginationMode="server"
        rowCount={totalRows}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        sx={{
          '--DataGrid-rowWidth': '100% !important',
        }}
        disableColumnSorting
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  );
};
