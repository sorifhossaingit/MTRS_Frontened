import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';

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
  ChevronDown
} from 'lucide-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,

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
      ChevronDown
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}