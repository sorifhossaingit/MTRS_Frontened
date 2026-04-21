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
    label: 'Doctor Master',
    icon: '👨‍⚕️',
    route: '/doctor-master',
    roles: ['Admin', 'Manager']
  },
  {
    label: 'Customer Master',
    icon: '👨‍⚕️',
    route: '/customer-master',
    roles: ['Admin', 'Manager']
  },
  {
    label: 'Stockist Master',
    icon: '👨‍⚕️',
    route: '/stockist-master',
    roles: ['Admin', 'Stockists']
  },
  {
    label: 'Product Master',
    icon: '👨‍⚕️',
    route: '/product-master',
    roles: ['Admin', 'Manager']
  },
  {
    label: 'Visits',
    icon: '📍',
    route: '/visits',
    roles: ['MR', 'Admin']
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