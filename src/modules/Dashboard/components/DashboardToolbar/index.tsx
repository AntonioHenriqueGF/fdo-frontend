import { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../../../Services/ApiRequest';
import type { Category } from '../../../Categories/models/Categories';
import type { GraphGranularity, PeriodPreset } from '../../models/GraphModels';
import { DashboardFiltersAtom } from '../../atoms/DashboardFiltersAtoms';
import {
  DEFAULT_PRESET,
  getPresetRange,
  PERIOD_PRESETS,
} from '../../utils/period';
import { DashboardToolbarWrapper } from './styles';

export const DashboardToolbar: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useAtom(DashboardFiltersAtom);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  // Applied when the menu closes, so ticking several categories triggers a single reload
  const [pendingCategoryIds, setPendingCategoryIds] = useState<string[]>(
    filters.category_id,
  );

  useEffect(() => {
    const abort = new AbortController();

    setLoadingCategories(true);
    ApiRequest<StandardApiResponse<Category[]>>({
      url: '/api/categories',
      method: 'GET',
      signal: abort.signal,
      callback: (response) => {
        setCategories(response.data.data);
      },
      errorCallback: () => {
        if (abort.signal.aborted) return;
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
  }, [enqueueSnackbar]);

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      value: String(category.cat_id),
      label: category.cat_description,
    }));
  }, [categories]);

  const handleGranularityChange = (
    _event: React.MouseEvent<HTMLElement>,
    granularity: GraphGranularity | null,
  ) => {
    if (!granularity || granularity === filters.granularity) return;

    // A custom date range is kept; a preset is swapped for the new mode's default
    // so daily mode doesn't open on years of daily bars
    if (filters.preset === null) {
      setFilters({ ...filters, granularity });
      return;
    }

    const preset = DEFAULT_PRESET[granularity];
    setFilters({
      ...filters,
      granularity,
      preset,
      ...getPresetRange(preset, granularity),
    });
  };

  const handlePresetChange = (
    _event: React.MouseEvent<HTMLElement>,
    preset: PeriodPreset | null,
  ) => {
    if (!preset) return;
    setFilters({
      ...filters,
      preset,
      ...getPresetRange(preset, filters.granularity),
    });
  };

  const handleDateChange =
    (field: 'date_start' | 'date_end') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, preset: null, [field]: event.target.value });
    };

  const handleCategoriesClose = () => {
    const changed =
      pendingCategoryIds.length !== filters.category_id.length ||
      pendingCategoryIds.some((id) => !filters.category_id.includes(id));

    if (changed) setFilters({ ...filters, category_id: pendingCategoryIds });
  };

  return (
    <DashboardToolbarWrapper>
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        value={filters.granularity}
        onChange={handleGranularityChange}
        aria-label="Chart granularity"
      >
        <ToggleButton value="monthly">Monthly</ToggleButton>
        <ToggleButton value="daily">Daily</ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        value={filters.preset}
        onChange={handlePresetChange}
        aria-label="Period"
      >
        {PERIOD_PRESETS.map((preset) => (
          <ToggleButton key={preset} value={preset}>
            {preset}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <div className="date-range">
        <TextField
          label="Start Date"
          type="date"
          size="small"
          value={filters.date_start}
          onChange={handleDateChange('date_start')}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { max: filters.date_end || undefined },
          }}
        />
        <TextField
          label="End Date"
          type="date"
          size="small"
          value={filters.date_end}
          onChange={handleDateChange('date_end')}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: filters.date_start || undefined },
          }}
        />
      </div>

      <FormControl
        size="small"
        className="categories"
        disabled={loadingCategories}
      >
        <InputLabel id="dashboard-category-filter-label" shrink>
          Categories
        </InputLabel>
        <Select
          labelId="dashboard-category-filter-label"
          multiple
          value={pendingCategoryIds}
          onChange={(event) => {
            const value = event.target.value;
            setPendingCategoryIds(
              typeof value === 'string' ? value.split(',') : value,
            );
          }}
          onClose={handleCategoriesClose}
          input={<OutlinedInput label="Categories" notched />}
          displayEmpty
          renderValue={(selected) => {
            if (selected.length === 0) return 'All Categories';

            return categoryOptions
              .filter((option) => selected.includes(option.value))
              .map((option) => option.label)
              .join(', ');
          }}
        >
          {categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={pendingCategoryIds.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </DashboardToolbarWrapper>
  );
};
