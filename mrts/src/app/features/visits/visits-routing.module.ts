import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterVisitDashboardComponent } from './pages/master-visit-dashboard/master-visit-dashboard.component';
import { AddVisitComponent } from './pages/add-visit/add-visit.component';
import { AssignVisitComponent } from './pages/assign-visit/assign-visit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'visit-master-dashboard',
        component: MasterVisitDashboardComponent
      },
      {
        path: 'add-visit',
        component: AddVisitComponent
      },
      {
        path: 'assign-visit',
        component: AssignVisitComponent
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
