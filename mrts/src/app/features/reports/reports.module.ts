import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './pages/reports/reports.component';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
