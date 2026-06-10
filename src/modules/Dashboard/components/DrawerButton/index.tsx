import { DrawerOpenAtom } from '../../atoms/DrawerAtoms';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAtom } from 'jotai';

export const DrawerButton: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(DrawerOpenAtom);

  const handleMenuClick = () => {
    localStorage.setItem('drawerOpen', (!isOpen).toString());
    setIsOpen(!isOpen);
  };

  return (
    <IconButton aria-label="Menu" color="inherit" className='drawer-button' onClick={handleMenuClick}>
      <MenuIcon />
    </IconButton>
  );
};