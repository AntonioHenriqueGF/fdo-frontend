import { CircularProgress } from '@mui/material';
import { LoadingWrapper } from './styles';



export const Loading: React.FC <React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (props) => {
  return (
    <LoadingWrapper {...props}>
      <CircularProgress aria-label="Loading…" />
    </LoadingWrapper>
  );
};