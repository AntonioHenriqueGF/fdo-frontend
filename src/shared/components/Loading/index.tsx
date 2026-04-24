import { CircularProgress } from '@mui/material';
import { LoadingWrapper } from './styles';

export const Loading: React.FC = () => {
  return (
    <LoadingWrapper>
      <CircularProgress aria-label="Loading…" />
    </LoadingWrapper>
  );
};