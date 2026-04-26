import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalRepresentativeRoutingModule } from './medical-representative-routing.module';
import { MedicalRepresentativeMasterDashboardComponent } from './pages/medical-representative-master-dashboard/medical-representative-master-dashboard.component';
import {
  UserCheck,
  Plus,
  ClipboardList,
  CheckCircle,
  MapPin,
  Route,
  Package,
  MapPinned,
  LucideAngularModule
} from 'lucide-angular';
import { AddMedicalRepresentativeComponent } from './pages/add-medical-representative/add-medical-representative.component';

@NgModule({
  declarations: [
    MedicalRepresentativeMasterDashboardComponent,
    AddMedicalRepresentativeComponent
  ],
  imports: [
    CommonModule,
    MedicalRepresentativeRoutingModule,
    FormsModule,
    LucideAngularModule.pick({
      UserCheck,
      Plus,
      ClipboardList,
      CheckCircle,
      MapPin,
      Route,
      Package,
      MapPinned
    })
  ]
})
export class MedicalRepresentativeModule { }
