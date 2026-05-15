import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
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
  Trash2,
  Eye,
  EyeOff,
  Lock
} from 'lucide-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
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
      Trash2,
      Lock,
      EyeOff,
      Eye
    })
  ],

  providers: [
  provideHttpClient(
    withInterceptors([authInterceptor])
  )
],



  bootstrap: [AppComponent]
})
export class AppModule {}