import { Link, useLocation } from 'react-router';
import { SidebarWrapper } from './styles';
import { useAtom } from 'jotai';
import { DrawerOpenAtom } from '../../atoms/DrawerAtoms';
import { useEffect, useMemo } from 'react';
import { DashboardSidebarLinks } from './Props';

export const Sidebar: React.FC = () => {
  const [isOpen] = useAtom(DrawerOpenAtom);
  const location = useLocation();

  useEffect(() => {
    // This code runs whenever the pathname changes
    console.log('Pathname changed to:', location.pathname);
    
    // Example: Trigger analytics or scroll to top
    window.scrollTo(0, 0);
  }, [location]); // Re-run effect when location object changes

  const links = useMemo(() => {
    return <>
      {DashboardSidebarLinks.map((link) => (
        <Link key={link.path} to={link.path} className={location.pathname === link.path ? 'active' : ''}>
          {link.icon}
          {link.label}
        </Link>
      ))}
    </>;
  }, [location.pathname]);

  return (
    <SidebarWrapper $isOpen={isOpen}>
      {links}
    </SidebarWrapper>
  );
};