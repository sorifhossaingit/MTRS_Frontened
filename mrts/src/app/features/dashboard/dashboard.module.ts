import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {
  LucideAngularModule,
  MapPin,
  Users,
  DollarSign,
  Clock
} from 'lucide-angular';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    LucideAngularModule.pick({
      MapPin,
      Users,
      DollarSign,
      Clock
    })
  ]
})
export class DashboardModule { }
