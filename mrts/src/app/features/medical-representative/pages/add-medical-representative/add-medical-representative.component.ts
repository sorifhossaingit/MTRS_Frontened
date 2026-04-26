import { Component } from '@angular/core';
import {
  UserPlus, ArrowLeft, User, Phone, Mail, MapPin,
  Briefcase, Calendar, UserCheck, Map, Route,
  Users, Building2, BarChart3, Target, TrendingUp,Hash,
  Percent, CheckCircle, Save
} from 'lucide-angular';

@Component({
  selector: 'app-add-medical-representative',
  templateUrl: './add-medical-representative.component.html',
  styleUrl: './add-medical-representative.component.css'
})
export class AddMedicalRepresentativeComponent {

  // Icons
  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  User = User;
  Phone = Phone;
  Mail = Mail;
  MapPin = MapPin;
  Briefcase = Briefcase;
  Calendar = Calendar;
  UserCheck = UserCheck;
  Map = Map;
  Route = Route;
  Users = Users;
  Building2 = Building2;
  BarChart3 = BarChart3;
  Target = Target;
  TrendingUp = TrendingUp;
  Percent = Percent;
  CheckCircle = CheckCircle;
  Save = Save;
  Hash = Hash;

  // Model
  mr: any = {
    isActive: true
  };

}
