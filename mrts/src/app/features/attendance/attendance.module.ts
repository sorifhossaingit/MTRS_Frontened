import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { FormsModule } from '@angular/forms';
import {Clock, LucideAngularModule} from 'lucide-angular';

@NgModule({
  declarations: [
    AttendanceComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    FormsModule,
    LucideAngularModule.pick({
      Clock
    })
  ]
})
export class AttendanceModule { }
