import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { SuperAdminUserControlComponent } from './pages/super-admin-user-control/super-admin-user-control.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'super-admin-dashboard',
        component: SuperAdminDashboardComponent
      },
      {
        path: 'user-control',
        component: SuperAdminUserControlComponent
      },
      {
        path: '',
        redirectTo: 'super-admin-dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminMasterRoutingModule { }
