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
import { AddCustomerMasterComponent } from './pages/add-customer-master/add-customer-master.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CustomerMasterDashboardComponent,
    AddCustomerMasterComponent
  ],
  imports: [
    CommonModule,
    CustomerMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      Trash2,
      Eye,
      Pencil,
      Users,
      Plus,
      Upload,
      CheckCircle,
      XCircle,
      TrendingUp,
      
    })
  ]
})
export class CustomerMasterModule { }
