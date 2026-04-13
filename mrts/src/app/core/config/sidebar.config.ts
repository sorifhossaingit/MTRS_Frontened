export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: '📊',
    route: '/dashboard',
    roles: ['Admin', 'Manager', 'MR']
  },
  {
    label: 'Doctors',
    icon: '👨‍⚕️',
    route: '/doctors',
    roles: ['Admin', 'Manager']
  },
  {
    label: 'Visits',
    icon: '📍',
    route: '/visits',
    roles: ['MR']
  },
  {
    label: 'Reports',
    icon: '📑',
    route: '/reports',
    roles: ['Admin']
  },
  {
    label: 'Attendance',
    icon: '🕒',
    route: '/attendance',
    roles: ['MR', 'Manager', 'Admin']
  }
];