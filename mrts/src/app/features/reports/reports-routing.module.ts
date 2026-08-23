import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './pages/reports/reports.component';
import { MonthlyReportComponent } from './pages/monthly-report/monthly-report.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'Report-dashboard',
        component: ReportsComponent
      },
            {
        path: 'monthly-Report-dashboard',
        component: MonthlyReportComponent
      },
      
      {
        path: '',
        redirectTo: 'Report-dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
