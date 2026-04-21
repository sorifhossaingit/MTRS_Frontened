import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMasterRoutingModule } from './product-master-routing.module';
import { ProductMasterComponent } from './pages/product-master/product-master.component';


@NgModule({
  declarations: [
    ProductMasterComponent
  ],
  imports: [
    CommonModule,
    ProductMasterRoutingModule
  ]
})
export class ProductMasterModule { }
