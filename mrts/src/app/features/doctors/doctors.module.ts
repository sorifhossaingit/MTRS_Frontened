import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorsRoutingModule } from './doctors-routing.module';
import { DoctorsListComponent } from './pages/doctors-list/doctors-list.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { DoctorsDashboardComponent } from './pages/doctors-dashboard/doctors-dashboard.component';


@NgModule({
  declarations: [
    DoctorsListComponent,
    DoctorsComponent,
    DoctorsDashboardComponent
  ],
  imports: [
    CommonModule,
    DoctorsRoutingModule
  ]
})
export class DoctorsModule { }
