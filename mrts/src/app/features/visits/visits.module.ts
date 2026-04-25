import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitsRoutingModule } from './visits-routing.module';
import { MasterVisitDashboardComponent } from './pages/master-visit-dashboard/master-visit-dashboard.component';
import {
  MapPin,
  Plus,
  Map,
  ShoppingCart,
  DollarSign,
  Users,
  Eye,
  LucideAngularModule
} from 'lucide-angular';



@NgModule({
  declarations: [
    MasterVisitDashboardComponent
 
  ],
  imports: [
    CommonModule,
    VisitsRoutingModule,
    LucideAngularModule.pick({
      MapPin,
      Plus,
      Map,  
      ShoppingCart,
      DollarSign,
      Users,
      Eye
    })
  ]
})
export class VisitsModule { }
