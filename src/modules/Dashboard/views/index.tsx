import { Outlet } from 'react-router';

export const Dashboard: React.FC = () => {
  return (
    <>
      <h1>FDO - Financial Data Overview</h1>
      <Outlet />
    </>
  );
};