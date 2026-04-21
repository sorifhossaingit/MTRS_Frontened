import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerMasterRoutingModule } from './customer-master-routing.module';
import { CustomerMasterComponent } from './pages/customer-master/customer-master.component';


@NgModule({
  declarations: [
    CustomerMasterComponent
  ],
  imports: [
    CommonModule,
    CustomerMasterRoutingModule
  ]
})
export class CustomerMasterModule { }
