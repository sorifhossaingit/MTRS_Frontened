import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaManagerRoutingModule } from './area-manager-routing.module';
import { AreaManagerDashboardComponent } from './pages/area-manager-dashboard/area-manager-dashboard.component';
import { AddAreaManagerComponent } from './pages/add-area-manager/add-area-manager.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Briefcase,
  UserPlus,
  Users,
  Activity,
  UserCheck,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  LucideAngularModule
} from 'lucide-angular';

@NgModule({
  declarations: [
    AreaManagerDashboardComponent,
    AddAreaManagerComponent
  ],
  imports: [
    CommonModule,
    AreaManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
      Briefcase,
      UserPlus,
      Users,
      Activity,
      UserCheck,
      Calendar,
      Eye,
      Pencil,
      Trash2
    })
  ]
})
export class AreaManagerModule { }
