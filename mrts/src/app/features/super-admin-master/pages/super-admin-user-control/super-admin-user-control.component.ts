import { Component } from '@angular/core';
import {
  Building2,
  ArrowLeft,
  FileText,
  BadgeCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  CreditCard,
  Layers,
  Calendar,
  CalendarCheck,
  Users,
  Activity,
  Save
} from 'lucide-angular';

@Component({
  selector: 'app-super-admin-user-control',
  templateUrl: './super-admin-user-control.component.html',
  styleUrl: './super-admin-user-control.component.css'
})
export class SuperAdminUserControlComponent {

  // Icons
   Building2 = Building2;
   ArrowLeft = ArrowLeft;
   FileText = FileText;
   BadgeCheck = BadgeCheck;
   User = User;
   Mail = Mail;
   Phone = Phone;
   MapPin = MapPin;
   Building = Building;
   Globe = Globe;
   CreditCard = CreditCard;
   Layers = Layers;
   Calendar = Calendar;
   CalendarCheck = CalendarCheck;
   Users = Users;
   Activity = Activity;
   Save = Save;

  // Form Model
  company = {
    companyName: '',
    gstNumber: '',
    licenseNumber: '',

    adminName: '',
    email: '',
    mobile: '',

    address: '',
    city: '',
    state: '',

    plan: '',
    startDate: '',
    expiryDate: '',

    totalEmployees: '',
    activeUsers: '',

    status: ''
  };

  saveCompany() {

    console.log('Company Saved:', this.company);

    alert('Company Added Successfully');

  }

}
