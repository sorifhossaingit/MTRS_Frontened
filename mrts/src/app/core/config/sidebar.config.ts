export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  roles: string[];
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'layout-dashboard',
    route: '/dashboard',
    roles: ['Admin', 'Manager', 'MR']
  },
  {
    label: 'Doctor Master',
    icon: 'stethoscope',
    route: '/doctor-master',
    roles: ['Admin', 'Manager'],
    children: [
      {
        label: 'Doctor Dashboard',
        icon: 'clipboard-list',
        route: '/doctor-master/doctor-master-dashboard',
        roles: ['Admin', 'Manager']
      },
      {
        label: 'Add Doctor',
        icon: 'bar-chart-3',
        route: '/doctor-master/add-doctor',
        roles: ['Admin', 'Manager']
      }
    ]
  },
  {
    label: 'Customer Master',
    icon: 'users',
    route: '/customer-master',
    roles: ['Admin', 'Manager'] ,
    children: [
      {
        label: 'Customer Master Dashboard',
        icon: 'clipboard-list',
        route: '/customer-master/customer-master-dashboard',
        roles: ['Admin', 'Manager']
      },
      // {
      //   label: 'Add Doctor',
      //   icon: 'bar-chart-3',
      //   route: '/doctor-master/add-doctor',
      //   roles: ['Admin', 'Manager']
      // }
    ]
  },
  {
    label: 'Stockist Master',
    icon: 'building-2',
    route: '/stockist-master',
    roles: ['Admin', 'Stockists'],
    children: [
      {
        label: 'Stockist Dashboard',
        icon: 'warehouse',
        route: '/stockist-master/stockist-master-dashboard',
        roles: ['Admin', 'Stockists']
      },
      {
        label: 'Add Stockist',
        icon: 'bar-chart-3',
        route: '/stockist-master/add-stockist',
        roles: ['Admin', 'Stockists']
      }
    ]
  },
  {
    label: 'Product Master',
    icon: 'package',
    route: '/product-master',
    roles: ['Admin', 'Manager']
  },
  {
    label: 'Visits',
    icon: 'map-pin',
    route: '/visits',
    roles: ['MR', 'Admin']
  },
  {
    label: 'Reports',
    icon: 'file-text',
    route: '/reports',
    roles: ['Admin']
  },
  {
    label: 'Attendance',
    icon: 'clock',
    route: '/attendance',
    roles: ['MR', 'Manager', 'Admin']
  }
];