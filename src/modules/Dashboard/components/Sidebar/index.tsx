import { Link } from 'react-router';
import { SidebarWrapper } from './styles';
import { useAtom } from 'jotai';
import { DrawerOpenAtom } from '../../atoms/DrawerAtoms';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export const Sidebar: React.FC = () => {
  const [isOpen] = useAtom(DrawerOpenAtom);
  return (
    <SidebarWrapper $isOpen={isOpen}>
      <Link to="/dashboard/statement-import">
        <UploadFileIcon />
        Import
      </Link>
    </SidebarWrapper>
  );
};