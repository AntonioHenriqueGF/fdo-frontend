import { Box, MenuItem, TextField } from '@mui/material';
import { useMemo } from 'react';
import type { Category } from '../../Categories/models/Categories';
import { IconButton } from '../../../shared/components/IconButton';
import SearchIcon from '@mui/icons-material/Search';

interface TransactionsFiltersFormProps {
  categories: Category[];
  loadingCategories: boolean;
  onSubmit: (filters: {
    category_id: string;
    date_start: string;
    date_end: string;
  }) => void;
}

export const TransactionsFiltersForm: React.FC<
  TransactionsFiltersFormProps
> = ({ categories, loadingCategories, onSubmit }) => {
  const categoryOptions = useMemo(() => {
    return [
      { value: '', label: 'All Categories' },
      ...categories.map((category) => ({
        value: String(category.cat_id),
        label: category.cat_description,
      })),
    ];
  }, [categories]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    onSubmit({
      category_id: String(formData.get('category_id') ?? ''),
      date_start: String(formData.get('date_start') ?? ''),
      date_end: String(formData.get('date_end') ?? ''),
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'grid', gap: 2, mb: 3 }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <TextField
          select
          label="Category"
          name="category_id"
          disabled={loadingCategories}
          size="small"
          defaultValue=""
          fullWidth
        >
          {categoryOptions.map((option) => (
            <MenuItem key={option.value || 'all'} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Start Date"
          type="date"
          name="date_start"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        <TextField
          label="End Date"
          type="date"
          name="date_end"
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            type="submit"
            variant="contained"
            color="primary"
            tooltipTitle="Search"
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
