export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  roles: string[];
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Super Admin Master',
    icon: 'users',
    route: '/super-admin-master',
    roles: ['Superadmin'],
    children: [
      {
        label: 'Superadmin Dashboard',
        icon: 'warehouse',
        route: '/super-admin-master/super-admin-dashboard',
        roles: ['Superadmin']
      },
      {
        label: 'Add User',
        icon: 'UserPlus',
        route: '/super-admin-master/user-control',
        roles: ['Superadmin']
      },
      
    ]
  },
  {
    label: 'Dashboard',
    icon: 'layout-dashboard',
    route: '/dashboard',
    roles: ['Admin']
  },
  {
    label: 'Doctor Master',
    icon: 'stethoscope',
    route: '/doctor-master',
    roles: ['Admin'],
    children: [
      {
        label: 'Doctor Dashboard',
        icon: 'clipboard-list',
        route: '/doctor-master/doctor-master-dashboard',
        roles: ['Admin']
      },
      {
        label: 'Add Doctor',
        icon: 'UserPlus',
        route: '/doctor-master/add-doctor',
        roles: ['Admin']
      }
    ]
  },
  {
    label: 'Customer Master',
    icon: 'users',
    route: '/customer-master',
    roles: ['Admin'],
    children: [
      {
        label: 'Customer Master Dashboard',
        icon: 'clipboard-list',
        route: '/customer-master/customer-master-dashboard',
        roles: ['Admin']
      },
      {
        label: 'Add Customer',
        icon: 'UserPlus',
        route: '/customer-master/add-customer-master',
        roles: ['Admin']
      }
    ]
  },
  {
    label: 'Stockist Master',
    icon: 'building-2',
    route: '/stockist-master',
    roles: ['Admin', 'Stockist'],
    children: [
      {
        label: 'Stockist Dashboard',
        icon: 'warehouse',
        route: '/stockist-master/stockist-master-dashboard',
        roles: ['Admin']
      },
      {
        label: 'Add Stockist',
        icon: 'UserPlus',
        route: '/stockist-master/add-stockist',
        roles: ['Admin']
      },
      {
        label: 'Stockist Product Dashboard',
        icon: 'Pill',
        route: '/stockist-master/stockist-product-dashboard',
        roles: ['Stockist']
      },
      {
        label: 'Order Master',
        icon: 'package',
        route: '/stockist-master/order-master',
        roles: ['Stockist']
      },
      {
        label: 'Order Details Master',
        icon: 'Pill',
        route: '/stockist-master/order-details-master',
        roles: ['Stockist']
      },
      {
        label: 'Medicine Order Master',
        icon: 'Pill',
        route: '/stockist-master/medicine-order-master',
        roles: ['Stockist']
      }
    ]
  },
  {
    label: 'Product Master',
    icon: 'package',
    route: '/product-master',
    roles: ['Admin'],
    children: [
      {
        label: 'Product Master Dashboard',
        icon: 'ClipboardList',
        route: '/product-master/product-master-dashboard',
        roles: ['Admin']
      },
      {
        label: 'Add Product Master',
        icon: 'UserPlus',
        route: '/product-master/add-product-master',
        roles: ['Admin']
      },
      {
        label: 'Stockist Order Details',
        icon: 'Pill',
        route: '/product-master/stockist-order-details',
        roles: ['Admin']
      }
    ]
  },
  {
    label: 'Representative Master',
    icon: 'Users', // group of representatives
    route: '/medical-representative-master',
    roles: ['Admin', 'MR' , 'Manager'],
    children: [
      {
        label: 'Representative Master Dashboard',
        icon: 'BarChart3', // dashboard analytics
        route: '/medical-representative-master/medical-representative-master-dashboard',
        roles: ['MR', 'Admin' , 'Manager']
      },
      {
        label: 'Add Representative',
        icon: 'UserPlus', // add new MR
        route: '/medical-representative-master/add-medical-representative',
        roles: ['Admin' , 'Manager']
      },
      {
        label: 'Medicine Master',
        icon: 'Pill', // add new MR
        route: '/medical-representative-master/medicine-master',
        roles: ['MR']
      },
      {
        label: 'Representative Order Master',
        icon: 'Pill', // add new MR
        route: '/medical-representative-master/mr-order-master',
        roles: ['MR', 'Admin', 'Manager']
      },
      {
        label: 'Representative Attendance',
        icon: 'clock', // add new MR
        route: '/medical-representative-master/mr-attendance',
        roles: ['MR']
      }
    ]
  },
 
  {
    label: 'Visits',
    icon: 'map-pin',
    route: '/visits',
    roles: ['MR', 'Admin' , 'Manager'],
    children: [
      {
        label: 'Visit Master Dashboard',
        icon: 'ClipboardList',
        route: '/visits/visit-master-dashboard',
        roles: ['Admin', 'Manager']
      },
      {
        label: 'Add Visit',
        icon: 'CalendarPlus',
        route: '/visits/add-visit',
        roles: ['Admin', 'MR']
      },
      {
        label: 'Assign Visit',
        icon: 'CalendarPlus',
        route: '/visits/assign-visit',
        roles: ['Admin', 'Manager']
      }

    ]
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
    roles: ['Manager', 'Admin']
  }
];