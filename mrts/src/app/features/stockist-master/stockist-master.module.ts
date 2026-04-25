import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockistMasterRoutingModule } from './stockist-master-routing.module';
import { StockistMasterDashboardComponent } from './pages/stockist-master-dashboard/stockist-master-dashboard.component';
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
import { AddStockistComponent } from './pages/add-stockist/add-stockist.component';

@NgModule({
  declarations: [
    StockistMasterDashboardComponent,
    AddStockistComponent
  ],
  imports: [
    CommonModule,
    StockistMasterRoutingModule,
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
export class StockistMasterModule { }
