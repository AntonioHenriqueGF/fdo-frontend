import { Link, useLocation } from 'react-router';
import { SidebarWrapper } from './styles';
import { useAtom } from 'jotai';
import { DrawerOpenAtom } from '../../atoms/DrawerAtoms';
import { useMemo } from 'react';
import { DashboardSidebarLinks } from './Props';

export const Sidebar: React.FC = () => {
  const [isOpen] = useAtom(DrawerOpenAtom);
  const location = useLocation();

  const links = useMemo(() => {
    return <>
      {DashboardSidebarLinks.map((link) => location.pathname === link.path ? (
        <div key={link.path} className="active" aria-label={link.label}>
          {link.icon}
          {link.label}
        </div>
      ) : (
        <Link key={link.path} to={link.path} aria-label={link.label}>
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