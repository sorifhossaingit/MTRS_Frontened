import { Component } from '@angular/core';
import {
  ClipboardCheck,
  ArrowLeft,
  Users,
  MapPin,
  Target,
  FileText,
  Send
} from 'lucide-angular';

@Component({
  selector: 'app-assign-visit',
  templateUrl: './assign-visit.component.html',
  styleUrl: './assign-visit.component.css'
})
export class AssignVisitComponent {

  ClipboardCheck = ClipboardCheck;
  ArrowLeft = ArrowLeft;
  Users = Users;
  MapPin = MapPin;
  Target = Target;
  FileText = FileText;
  Send = Send;

  assign: any = {};

  mrList = ['Rahul', 'Amit'];

  doctorList = ['Dr. Sharma', 'Dr. Roy'];
  hospitalList = ['Apollo Hospital', 'City Hospital'];
  clinicList = ['Care Clinic', 'Health Clinic'];
  instituteList = ['Medical College', 'Nursing Institute'];
  shopList = ['MedPlus', 'Apollo Pharmacy'];

  onSubmit() {
    console.log('Assigned Visit:', this.assign);
  }
}
