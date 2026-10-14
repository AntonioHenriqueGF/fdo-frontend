import { Box, Skeleton, Typography } from '@mui/material';
import { CHART_HEIGHT } from '../../utils/charts';
import { ChartCardBody, ChartCardHeader, ChartCardWrapper } from './styles';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  // Headline figure shown next to the title, e.g. the latest balance
  headline?: React.ReactNode;
  loading: boolean;
  empty: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  headline,
  loading,
  empty,
  emptyMessage = 'No data found for the selected filters.',
  children,
}) => {
  return (
    <ChartCardWrapper>
      <ChartCardHeader>
        <div>
          <h3>{title}</h3>
          {subtitle ? (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </div>
        {headline && !loading && !empty ? (
          <div className="headline">{headline}</div>
        ) : null}
      </ChartCardHeader>
      <ChartCardBody style={{ height: CHART_HEIGHT }}>
        {loading ? (
          <Skeleton
            variant="rounded"
            width="100%"
            height="100%"
            animation="pulse"
          />
        ) : empty ? (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          children
        )}
      </ChartCardBody>
    </ChartCardWrapper>
  );
};
