import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalRepresentativeMasterDashboardComponent } from './pages/medical-representative-master-dashboard/medical-representative-master-dashboard.component';
import { AddMedicalRepresentativeComponent } from './pages/add-medical-representative/add-medical-representative.component';
import { MedicineMasterComponent } from './pages/medicine-master/medicine-master.component';
import { MrOrderMasterComponent } from './pages/mr-order-master/mr-order-master.component';
import { MrAttendanceComponent } from './pages/mr-attendance/mr-attendance.component';
import { MrDashboardComponent } from './pages/mr-dashboard/mr-dashboard.component';
import { MrVisitDashboardComponent } from './pages/mr-visit-dashboard/mr-visit-dashboard.component';
import { AddCustomerMasterComponent } from '../customer-master/pages/add-customer-master/add-customer-master.component';
import { CustomerMasterDashboardComponent } from '../customer-master/pages/customer-master-dashboard/customer-master-dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'medical-representative-master-dashboard',
        component: MedicalRepresentativeMasterDashboardComponent
      },
      {
        path: 'medical-representative-dashboard',
        component: MrDashboardComponent
      },
      {
        path: 'add-medical-representative',
        component: AddMedicalRepresentativeComponent
      },
      {
        path: 'medicine-master',
        component: MedicineMasterComponent
      },
      {
        path: 'mr-order-master',
        component: MrOrderMasterComponent
      },
      {
        path: 'mr-attendance',
        component: MrAttendanceComponent
      },
      {
        path: 'mr-visit-dashboard',
        component: MrVisitDashboardComponent
      },
      {
        path: 'customer-dashboard',
        component: CustomerMasterDashboardComponent
      },
      {
        path: 'add-customer',
        component: AddCustomerMasterComponent
      },

      {
        path: '',
        redirectTo: 'medical-representative-master',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalRepresentativeRoutingModule { }
