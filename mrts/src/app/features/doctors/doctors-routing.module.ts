import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorsListComponent } from './pages/doctors-list/doctors-list.component';
import { DoctorsDashboardComponent } from './pages/doctors-dashboard/doctors-dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'doctor-master-dashboard',
        component: DoctorsDashboardComponent
      },
      {
        path: 'add-doctor',
        component: DoctorsListComponent
      },
      {
        path: '',
        redirectTo: 'doctor-master-dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }
