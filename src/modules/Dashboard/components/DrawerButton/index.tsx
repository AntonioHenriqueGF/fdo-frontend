import { DrawerOpenAtom } from '../../atoms/DrawerAtoms';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAtom } from 'jotai';

export const DrawerButton: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(DrawerOpenAtom);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <IconButton aria-label="Menu" color="inherit" onClick={handleMenuClick}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </IconButton>
  );
};