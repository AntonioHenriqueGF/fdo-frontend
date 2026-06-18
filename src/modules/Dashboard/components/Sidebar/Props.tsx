import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import HomeIcon from '@mui/icons-material/Home';
import LabelIcon from '@mui/icons-material/Label';

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
  {
    path: '/dashboard/categories',
    icon: <LabelIcon />,
    label: 'Categories',
  },
];