import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockistMasterRoutingModule } from './stockist-master-routing.module';
import { StockistMasterComponent } from './pages/stockist-master/stockist-master.component';


@NgModule({
  declarations: [
    StockistMasterComponent
  ],
  imports: [
    CommonModule,
    StockistMasterRoutingModule
  ]
})
export class StockistMasterModule { }
