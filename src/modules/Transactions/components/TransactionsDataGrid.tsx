import { Alert, Box } from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useMemo } from 'react';
import type { Transaction } from '../models/TransactionResponse';

import { IconButton } from '../../../shared/components/IconButton';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

interface TransactionsDataGridProps {
  rows: Transaction[];
  loading: boolean;
  totalRows: number;
  selectedTransactionId: number | null;
  paginationModel: GridPaginationModel;
  onSelectTransaction: (id: number | null) => void;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onCreateClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50, 100];

export const TransactionsDataGrid: React.FC<TransactionsDataGridProps> = ({
  rows,
  loading,
  totalRows,
  selectedTransactionId,
  paginationModel,
  onSelectTransaction,
  onPaginationModelChange,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}) => {
  const totalPages = Math.max(
    1,
    Math.ceil(totalRows / paginationModel.pageSize),
  );
  const hasSelectedTransaction = selectedTransactionId !== null;
  const rowSelectionModel: GridRowSelectionModel = {
    type: 'include',
    ids: selectedTransactionId ? new Set([selectedTransactionId]) : new Set(),
  };

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
        <IconButton
          size="small"
          variant="contained"
          onClick={onCreateClick}
          disabled={loading}
          tooltipTitle="Create Transaction"
        >
          <LibraryAddIcon />
        </IconButton>
        <IconButton
          size="small"
          variant="contained"
          onClick={onEditClick}
          disabled={loading || !hasSelectedTransaction}
          tooltipTitle="Edit Transaction"
          color="warning"
        >
          <CreateIcon />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          variant="contained"
          onClick={onDeleteClick}
          disabled={loading || !hasSelectedTransaction}
          tooltipTitle="Delete Transaction"
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          size="small"
          variant="contained"
          onClick={goToFirstPage}
          disabled={loading || paginationModel.page === 0}
          tooltipTitle="First Page"
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton
          size="small"
          variant="contained"
          onClick={goToLastPage}
          disabled={
            loading || paginationModel.page >= totalPages - 1 || totalRows === 0
          }
          tooltipTitle="Last Page"
        >
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.tra_id}
        loading={loading}
        pagination
        paginationMode="server"
        rowCount={totalRows}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(selectionModel) => {
          const firstSelection = selectionModel.ids.values().next().value;
          onSelectTransaction(
            typeof firstSelection === 'number' ? firstSelection : null,
          );
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
