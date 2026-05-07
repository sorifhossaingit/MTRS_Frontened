import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [

  // 👉 Default route → Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 👉 Auth Module
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },

  // 👉 Protected App
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],   // 🔐 login required
    children: [

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },

      {
        path: 'doctor-master',
        loadChildren: () =>
          import('./features/doctors/doctors.module')
            .then(m => m.DoctorsModule),
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }   
      },

      {
        path: 'customer-master',
        loadChildren: () =>
          import('./features/customer-master/customer-master.module')
            .then(m => m.CustomerMasterModule),
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }   
      },

      {
        path: 'stockist-master',
        loadChildren: () =>
          import('./features/stockist-master/stockist-master.module')
            .then(m => m.StockistMasterModule),
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Stockist'] }   
      },

      {
        path: 'product-master',
        loadChildren: () =>
          import('./features/product-master/product-master.module')
            .then(m => m.ProductMasterModule),
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }   
      },

      {
        path: 'visits',
        loadChildren: () =>
          import('./features/visits/visits.module')
            .then(m => m.VisitsModule),
        canActivate: [RoleGuard],
        data: { roles: ['MR' , 'Admin' , 'Manager'] }
      },

      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/reports.module')
            .then(m => m.ReportsModule),
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] }
      },

      {
        path: 'attendance',
        loadChildren: () =>
          import('./features/attendance/attendance.module')
            .then(m => m.AttendanceModule),
        canActivate: [RoleGuard],
        data: { roles: ['Admin', 'Manager'] }
      },

      {
        path: 'medical-representative-master',
        loadChildren: () =>
          import('./features/medical-representative/medical-representative.module')
            .then(m => m.MedicalRepresentativeModule),
        canActivate: [RoleGuard],
        data: { roles: ['MR', 'Admin', 'Manager'] }
      },

      {
        path: 'super-admin-master',
        loadChildren: () =>
          import('./features/super-admin-master/super-admin-master.module')
            .then(m => m.SuperAdminMasterModule),
        canActivate: [RoleGuard],
        data: { roles: ['Superadmin'] }
      },


    ]
  },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}