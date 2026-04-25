import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMasterRoutingModule } from './product-master-routing.module';
import { ProductMasterDashboardComponent } from './pages/product-master-dashboard/product-master-dashboard.component';
import {
  Package,
  Plus,
  Upload,
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  Pencil,
  Trash2,
  LucideAngularModule
} from 'lucide-angular';
import { AddProductMasterComponent } from './pages/add-product-master/add-product-master.component';


@NgModule({
  declarations: [
    ProductMasterDashboardComponent,
    AddProductMasterComponent
  ],
  imports: [
    CommonModule,
    ProductMasterRoutingModule,
    LucideAngularModule.pick({
      Package,
      Plus,
      Upload,
      CheckCircle,
      XCircle,
      TrendingUp,
      Eye,
      Pencil,
      Trash2
    })
  ]
})
export class ProductMasterModule { }
