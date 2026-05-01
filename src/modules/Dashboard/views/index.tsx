import { Outlet } from 'react-router';

import LogoIcon from '../../../assets/logo.svg?react';
import { ContentWrapper, HeaderWrapper } from './styles';
import { Sidebar } from '../components/Sidebar';
import { DrawerButton } from '../components/DrawerButton';

export const Dashboard: React.FC = () => {
  return (
    <>
      <HeaderWrapper>
        <DrawerButton />
        <LogoIcon width={45} height={45} title='Logo FDO' aria-label='logo' className='logo-icon' />
        <h1>FDO | Financial Data Overview</h1>
      </HeaderWrapper>
      <ContentWrapper>
        <Sidebar />
        <div className='page-content'>
          <Outlet />
        </div>
      </ContentWrapper>
    </>
  );
};