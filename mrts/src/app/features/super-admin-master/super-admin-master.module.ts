import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SuperAdminMasterRoutingModule } from './super-admin-master-routing.module';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { SuperAdminUserControlComponent } from './pages/super-admin-user-control/super-admin-user-control.component';
import {
  ShieldCheck,
  UserPlus,
  Building2,
  BadgeCheck,
  AlertTriangle,
  Users,
  Eye,
  Pencil,
  Trash2,
  LucideAngularModule
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SuperAdminDashboardComponent,
    SuperAdminUserControlComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SuperAdminMasterRoutingModule,
    FormsModule,
    LucideAngularModule.pick({
      ShieldCheck,
      UserPlus,
      Building2,
      BadgeCheck,
      AlertTriangle,
      Users,
      Eye,
      Pencil,
      Trash2
    })
  ]
})
export class SuperAdminMasterModule { }
