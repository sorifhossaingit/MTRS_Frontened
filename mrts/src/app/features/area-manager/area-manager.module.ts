import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaManagerRoutingModule } from './area-manager-routing.module';
import { AreaManagerDashboardComponent } from './pages/area-manager-dashboard/area-manager-dashboard.component';
import { AddAreaManagerComponent } from './pages/add-area-manager/add-area-manager.component';


@NgModule({
  declarations: [
    AreaManagerDashboardComponent,
    AddAreaManagerComponent
  ],
  imports: [
    CommonModule,
    AreaManagerRoutingModule
  ]
})
export class AreaManagerModule { }
