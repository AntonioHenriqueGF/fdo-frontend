import type { DividerProps } from '@mui/material';
import { ContentPadSmallStyle } from './styles';

export const ContentPadSmall: React.FC<DividerProps> = ({ ...props }) => {
  return <ContentPadSmallStyle className='content-pad' {...props} />;
};