import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsRoutingModule } from './doctors-routing.module';
import { DoctorsListComponent } from './pages/doctors-list/doctors-list.component';
import { DoctorsDashboardComponent } from './pages/doctors-dashboard/doctors-dashboard.component';
import { FormsModule } from '@angular/forms';
import {
  Stethoscope,
  Users,
  Activity,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  LucideAngularModule,
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building,
  Clock,
  // Calendar,
  BarChart3,
  Layers,
  TrendingUp,
  FileText,
  CalendarCheck,
  Repeat,
  Save,
  GraduationCap,
  // Stethoscope
} from 'lucide-angular';



@NgModule({
  declarations: [
    DoctorsListComponent,
    DoctorsDashboardComponent
  ],
  imports: [
    CommonModule,
    DoctorsRoutingModule,
    FormsModule,
    LucideAngularModule.pick({
      Stethoscope,
      Users,
      Activity,
      Calendar,
      Eye,
      Pencil,
      Trash2,
      UserPlus,
      ArrowLeft,
      User,
      Phone,
      Mail,
      Building,
      Clock,
      // Calendar,
      BarChart3,
      Layers,
      TrendingUp,
      FileText,
      CalendarCheck,
      Repeat,
      Save,
      GraduationCap,
      // Stethoscope
    })
  ]
})
export class DoctorsModule { }
