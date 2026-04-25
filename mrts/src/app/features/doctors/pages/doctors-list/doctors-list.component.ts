import { Component } from '@angular/core';
import { Save, UserPlus } from 'lucide-angular';

import {
  User,
  // UserPlus,
  ArrowLeft,
  Phone,
  Mail,
  Building,
  Clock,
  Calendar,
  CalendarCheck,
  Repeat,
  GraduationCap,
  Stethoscope,
  BarChart3,
  Layers,
  TrendingUp,
  FileText
} from 'lucide-angular';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent {

 User = User;
  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  Phone = Phone;
  Mail = Mail;
  Building = Building;
  Clock = Clock;
  Calendar = Calendar;
  CalendarCheck = CalendarCheck;
  Repeat = Repeat;
  GraduationCap = GraduationCap;
  Stethoscope = Stethoscope;
  BarChart3 = BarChart3;
  Layers = Layers;
  TrendingUp = TrendingUp;
  FileText = FileText;
  Save = Save;
  doctor: any = {};
}
