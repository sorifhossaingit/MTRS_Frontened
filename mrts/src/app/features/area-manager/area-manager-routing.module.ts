import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaManagerDashboardComponent } from './pages/area-manager-dashboard/area-manager-dashboard.component';
import { AddAreaManagerComponent } from './pages/add-area-manager/add-area-manager.component';
import { AreaManagementComponent } from './pages/area-management/area-management.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'area-manager-dashboard',
        component: AreaManagerDashboardComponent
      },
      {
        path: 'add-area-manager',
        component: AddAreaManagerComponent
      },
            {
        path: 'add-area',
        component: AreaManagementComponent
      },
      {
        path: '',
        redirectTo: 'area-manager',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaManagerRoutingModule { }
