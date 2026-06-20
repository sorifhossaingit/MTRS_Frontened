import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

import {
  LucideAngularModule,
  MapPin,
  Users,
  Building2,
  BriefcaseBusiness
} from 'lucide-angular';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    BaseChartDirective,
    LucideAngularModule.pick({
      MapPin,
      Users,
      Building2,
      BriefcaseBusiness
    })
  ]
})
export class DashboardModule { }