import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterVisitDashboardComponent } from './pages/master-visit-dashboard/master-visit-dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'visit-master-dashboard',
        component: MasterVisitDashboardComponent
      },
      {
        path: '',
        redirectTo: 'visit-master-dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitsRoutingModule { }
