import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockistMasterRoutingModule } from './stockist-master-routing.module';
import { StockistMasterDashboardComponent } from './pages/stockist-master-dashboard/stockist-master-dashboard.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
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
  XCircle
  // Stethoscope
} from 'lucide-angular';
import { AddStockistComponent } from './pages/add-stockist/add-stockist.component';
import { OrderDetailsMasterComponent } from './pages/order-details-master/order-details-master.component';
import { StockistProductDashboardComponent } from './pages/stockist-product-dashboard/stockist-product-dashboard.component';
import { OrderMasterComponent } from './pages/order-master/order-master.component';
import { MedicineOrderMasterComponent } from './pages/medicine-order-master/medicine-order-master.component';
import { StockiestPersonalproductDashboardComponent } from './pages/stockiest-personalproduct-dashboard/stockiest-personalproduct-dashboard.component';

@NgModule({
  declarations: [
    StockistMasterDashboardComponent,
    AddStockistComponent,
    OrderDetailsMasterComponent,
    StockistProductDashboardComponent,
    OrderMasterComponent,
    MedicineOrderMasterComponent,
    StockiestPersonalproductDashboardComponent
  ],
  imports: [
    CommonModule,
    StockistMasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
      XCircle
      // Stethoscope
    })
  ]
})
export class StockistMasterModule { }
