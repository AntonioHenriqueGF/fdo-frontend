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

interface TransactionFormValues {
  tra_description: string;
  tra_amount: string;
  tra_date: string;
}

interface TransactionFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  loading: boolean;
  initialValues?: TransactionFormValues;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues) => void;
}

const defaultValues: TransactionFormValues = {
  tra_description: '',
  tra_amount: '',
  tra_date: '',
};

const toDateInputValue = (value?: string): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  open,
  mode,
  loading,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState<TransactionFormValues>(defaultValues);

  useEffect(() => {
    if (!open) return;

    setValues({
      tra_description: initialValues?.tra_description ?? '',
      tra_amount: initialValues?.tra_amount ?? '',
      tra_date: toDateInputValue(initialValues?.tra_date),
    });
  }, [initialValues, open]);

  const handleChange = (field: keyof TransactionFormValues, value: string) => {
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
          {mode === 'create' ? 'Create Transaction' : 'Edit Transaction'}
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: '8px !important' }}>
          <TextField
            label="Description"
            value={values.tra_description}
            onChange={(event) =>
              handleChange('tra_description', event.target.value)
            }
            size="small"
            required
            fullWidth
          />
          <TextField
            label="Amount"
            type="number"
            value={values.tra_amount}
            onChange={(event) => handleChange('tra_amount', event.target.value)}
            required
            slotProps={{ htmlInput: { step: '0.01' } }}
            size="small"
            fullWidth
          />
          <TextField
            label="Date"
            type="date"
            value={values.tra_date}
            onChange={(event) => handleChange('tra_date', event.target.value)}
            required
            slotProps={{ inputLabel: { shrink: true } }}
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
