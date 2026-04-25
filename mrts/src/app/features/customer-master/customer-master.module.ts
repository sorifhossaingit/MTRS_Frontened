import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerMasterRoutingModule } from './customer-master-routing.module';
import { CustomerMasterDashboardComponent } from './pages/customer-master-dashboard/customer-master-dashboard.component';
import {
  LucideAngularModule,
  Trash2,
  Eye,
  Pencil,
  Users,
  Plus,
  Upload,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-angular';


@NgModule({
  declarations: [
    CustomerMasterDashboardComponent
  ],
  imports: [
    CommonModule,
    CustomerMasterRoutingModule,
    LucideAngularModule.pick({
      Trash2,
      Eye,
      Pencil,
      Users,
      Plus,
      Upload,
      CheckCircle,
      XCircle,
      TrendingUp
    })
  ]
})
export class CustomerMasterModule { }
