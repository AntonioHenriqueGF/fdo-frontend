import { Box, Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import type { Category } from '../../../Categories/models/Categories';
import type { DashboardCategoryFilters } from '../../models/GraphModels';

interface DashboardCategoryFiltersFormProps {
  categories: Category[];
  loadingCategories: boolean;
  initialFilters: DashboardCategoryFilters;
  onSubmit: (filters: DashboardCategoryFilters) => void;
}

export const DashboardCategoryFiltersForm: React.FC<DashboardCategoryFiltersFormProps> = ({
  categories,
  loadingCategories,
  initialFilters,
  onSubmit,
}) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialFilters.category_id);
  const [dateStart, setDateStart] = useState(initialFilters.date_start);
  const [dateEnd, setDateEnd] = useState(initialFilters.date_end);

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      value: String(category.cat_id),
      label: category.cat_description,
    }));
  }, [categories]);

  useEffect(() => {
    setSelectedCategoryIds(initialFilters.category_id);
    setDateStart(initialFilters.date_start);
    setDateEnd(initialFilters.date_end);
  }, [initialFilters]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      category_id: selectedCategoryIds,
      date_start: dateStart,
      date_end: dateEnd,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mb: 3, mt: 15 }}>
      <h2>Filter Categories</h2>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 2fr) repeat(3, 1fr)' }, gap: 2 }}>
        <FormControl size="small" fullWidth disabled={loadingCategories}>
          <InputLabel id="dashboard-category-filter-label">Categories</InputLabel>
          <Select
            labelId="dashboard-category-filter-label"
            multiple
            name="category_id[]"
            value={selectedCategoryIds}
            onChange={(event) => {
              const value = event.target.value;
              setSelectedCategoryIds(typeof value === 'string' ? value.split(',') : value);
            }}
            input={<OutlinedInput label="Categories" />}
            renderValue={(selected) => {
              const selectedValues = selected as string[];

              if (selectedValues.length === 0) {
                return 'All Categories';
              }

              return categoryOptions
                .filter((option) => selectedValues.includes(option.value))
                .map((option) => option.label)
                .join(', ');
            }}
          >
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={selectedCategoryIds.includes(option.value)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          name="date_start"
          size="small"
          value={dateStart}
          onChange={(event) => setDateStart(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        <TextField
          label="End Date"
          type="date"
          name="date_end"
          size="small"
          value={dateEnd}
          onChange={(event) => setDateEnd(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button type="submit" variant="contained" fullWidth>
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};