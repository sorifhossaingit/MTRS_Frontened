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
import { AddVisitComponent } from './pages/add-visit/add-visit.component';
import { FormsModule } from '@angular/forms';
import { AssignVisitComponent } from './pages/assign-visit/assign-visit.component';




@NgModule({
  declarations: [
    MasterVisitDashboardComponent,
    AddVisitComponent,
    AssignVisitComponent
 
  ],
  imports: [
    CommonModule,
    VisitsRoutingModule,
    FormsModule,
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
