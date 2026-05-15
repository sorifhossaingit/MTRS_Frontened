import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import {
  LucideAngularModule,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Activity,
  MapPin,
  ClipboardList,
  BarChart3,
  CalendarCheck,
  EyeOff,
  Eye

} from 'lucide-angular';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    LucideAngularModule.pick({
      Mail,
      Lock,
      LogIn,
      AlertCircle,
      HelpCircle,
      ShieldCheck,
      Activity,
      MapPin,
      ClipboardList,
      BarChart3,
      CalendarCheck,
      EyeOff,
      Eye
    })
  ]
})
export class AuthModule { }
