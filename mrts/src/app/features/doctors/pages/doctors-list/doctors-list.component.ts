import { Component } from '@angular/core';
import { Save, UserPlus } from 'lucide-angular';

// lucide icons import

import {
  ArrowLeft,
  User,
  GraduationCap,
  Stethoscope,
  Phone,
  Mail,
  Building,
  Building2,
  Hospital,
  Clock,
  Calendar,
  CalendarCheck,
  BarChart3,
  Layers,
  TrendingUp,
  FileText,
  Repeat,
  Smile,
  UserCheck,
  MapPin
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
  Building2 = Building2;
  Smile = Smile;
  UserCheck = UserCheck;
  MapPin = MapPin;
  Hospital = Hospital;


  doctor: any = {};


mrList = [
  {
    id: 1,
    name: 'Rahul Sharma'
  },
  {
    id: 2,
    name: 'Amit Das'
  }
];

saveDoctor(){
  
}






}
