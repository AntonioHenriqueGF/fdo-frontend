import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface DailyBalanceFormValues {
  dba_date: string;
  dba_closing_balance: string;
}

interface DailyBalanceFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  initialValues?: DailyBalanceFormValues;
  onClose: () => void;
  onSubmit: (values: DailyBalanceFormValues) => void;
}

const defaultValues: DailyBalanceFormValues = {
  dba_date: '',
  dba_closing_balance: '',
};

const toDateInputValue = (value?: string): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const DailyBalanceFormModal: React.FC<DailyBalanceFormModalProps> = ({
  open,
  mode,
  loading,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<DailyBalanceFormValues>(defaultValues);

  useEffect(() => {
    if (!open) return;

    setValues({
      dba_date: toDateInputValue(initialValues?.dba_date),
      dba_closing_balance: initialValues?.dba_closing_balance ?? '',
    });
  }, [initialValues, open]);

  const handleChange = (field: keyof DailyBalanceFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === 'create' ? 'Create Daily Balance' : 'Edit Daily Balance'}
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: '8px !important' }}>
          <TextField
            label="Date"
            type="date"
            value={values.dba_date}
            onChange={(event) => handleChange('dba_date', event.target.value)}
            required
            slotProps={{ inputLabel: { shrink: true } }}
            size="small"
            fullWidth
          />
          <TextField
            label="Closing Balance"
            type="number"
            value={values.dba_closing_balance}
            onChange={(event) =>
              handleChange('dba_closing_balance', event.target.value)
            }
            required
            slotProps={{ htmlInput: { step: '0.01' } }}
            size="small"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
