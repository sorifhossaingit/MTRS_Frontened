import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './pages/attendance/attendance.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'attendance-master-dashboard',
        component: AttendanceComponent
      },
      {
        path: '',
        redirectTo: 'attendance-master-dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
