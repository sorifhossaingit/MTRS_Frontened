import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerMasterDashboardComponent } from './pages/customer-master-dashboard/customer-master-dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'customer-master-dashboard',
        component: CustomerMasterDashboardComponent
      },
      // {
      //   path: 'add-doctor',
      //   component: DoctorsListComponent
      // },
      {
        path: '',
        redirectTo: 'customer-master-dashboard',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMasterRoutingModule { }
