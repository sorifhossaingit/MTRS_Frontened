import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutComponent } from './layout/layout.component';

import {
  LucideAngularModule,
  LayoutDashboard,
  Stethoscope,
  ClipboardList,
  BarChart3,
  Users,
  Building2,
  Package,
  MapPin,
  FileText,
  Clock,
  ChevronDown,
  Menu,
  // Stethoscope,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  PackagePlus,
  Warehouse,
  UserPlus
} from 'lucide-angular';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    // ✅ THIS IS THE REAL FIX
    LucideAngularModule.pick({
      LayoutDashboard,
      Stethoscope,
      ClipboardList,
      BarChart3,
      Users,
      Building2,
      Package,
      MapPin,
      FileText,
      Clock,
      ChevronDown,
      Menu,
      // Stethoscope,
      Search,
      Bell,
      User,
      Settings,
      LogOut,
      PackagePlus,
      Warehouse,
      UserPlus

    })
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutModule { }