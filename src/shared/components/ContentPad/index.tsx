import type { DividerProps } from '@mui/material';
import { ContentPadStyle } from './styles';

export const ContentPad: React.FC<DividerProps> = ({ ...props }) => {
  return <ContentPadStyle className='content-pad' {...props} />;
};