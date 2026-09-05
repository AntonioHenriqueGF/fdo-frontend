import { Box, TextField } from '@mui/material';

interface DailyBalancesFiltersFormProps {
  onSubmit: (filters: { date_start: string; date_end: string }) => void;
}
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '../../../shared/components/IconButton';

export const DailyBalancesFiltersForm: React.FC<
  DailyBalancesFiltersFormProps
> = ({ onSubmit }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    onSubmit({
      date_start: String(formData.get('date_start') ?? ''),
      date_end: String(formData.get('date_end') ?? ''),
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'grid', gap: 2, mb: 2, mt: 2 }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
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
