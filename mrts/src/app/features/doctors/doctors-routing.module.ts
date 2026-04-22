import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { DoctorsListComponent } from './pages/doctors-list/doctors-list.component';
import { DoctorsDashboardComponent } from './pages/doctors-dashboard/doctors-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorsComponent,
    children: [
      {
        path: 'master',
        component: DoctorsListComponent
      },
      {
        path: 'dashboard',
        component: DoctorsDashboardComponent
      },
      {
        path: '',
        redirectTo: 'master',
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
