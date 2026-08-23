import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './pages/reports/reports.component';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { MonthlyReportComponent } from './pages/monthly-report/monthly-report.component';


@NgModule({
  declarations: [
    ReportsComponent,
    MonthlyReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
