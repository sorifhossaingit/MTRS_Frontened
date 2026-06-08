import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
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
import { MedicineMasterComponent } from './pages/medicine-master/medicine-master.component';
import { MrAttendanceComponent } from './pages/mr-attendance/mr-attendance.component';
import { MrOrderMasterComponent } from './pages/mr-order-master/mr-order-master.component';
import { MrDashboardComponent } from './pages/mr-dashboard/mr-dashboard.component';

@NgModule({
  declarations: [
    MedicalRepresentativeMasterDashboardComponent,
    AddMedicalRepresentativeComponent,
    MedicineMasterComponent,
    MrAttendanceComponent,
    MrOrderMasterComponent,
    MrDashboardComponent
  ],
  imports: [
    CommonModule,
    MedicalRepresentativeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
