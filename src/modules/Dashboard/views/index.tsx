import { Outlet, useNavigate } from 'react-router';

import LogoIcon from '../../../assets/logo.svg?react';
import { ContentWrapper, headerStyles, HeaderWrapper } from './styles';
import { Sidebar } from '../components/Sidebar';
import { DrawerButton } from '../components/DrawerButton';
import { Button } from '@mui/material';
import { useCallback } from 'react';
import { ApiRequest } from '../../../Services/ApiRequest';
import { useSnackbar } from 'notistack';
import { useAtom } from 'jotai';
import { DrawerOpenAtom } from '../atoms/DrawerAtoms';

export const Dashboard: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    ApiRequest({
      url: '/api/logout',
      method: 'POST',
      callback: () => {
        enqueueSnackbar('Logout successful', { variant: 'success' });
        navigate('/login');
      },
    });
  }, [enqueueSnackbar, navigate]);

  const [isOpen] = useAtom(DrawerOpenAtom);
  return (
    <>
      <HeaderWrapper>
        <DrawerButton />
        <LogoIcon
          width={45}
          height={45}
          title="Logo FDO"
          aria-label="logo"
          className="logo-icon"
        />
        <h1>FDO | Financial Data Overview</h1>
        <Button
          variant="text"
          size="small"
          className="logout-button"
          onClick={handleLogout}
          style={headerStyles.logoutButton}
        >
          Logout
        </Button>
      </HeaderWrapper>
      <ContentWrapper>
        <Sidebar />
        <div className={`page-content ${isOpen ? 'open' : 'closed'}`}>
          <Outlet />
        </div>
      </ContentWrapper>
    </>
  );
};
