import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import HomeIcon from '@mui/icons-material/Home';

export const DashboardSidebarLinks = [
  {
    path: '/dashboard',
    icon: <HomeIcon />,
    label: 'Dashboard',
  },
  {
    path: '/dashboard/statement-import',
    icon: <InsertDriveFileIcon />,
    label: 'Import',
  },
];