import { Component } from '@angular/core';
import {
  UserCheck,
  Plus,
  ClipboardList,
  CheckCircle,
  MapPin,
  Route,
  Package,
  MapPinned
} from 'lucide-angular';

@Component({
  selector: 'app-medical-representative-master-dashboard',
  templateUrl: './medical-representative-master-dashboard.component.html',
  styleUrl: './medical-representative-master-dashboard.component.css'
})
export class MedicalRepresentativeMasterDashboardComponent {

  UserCheck = UserCheck;
  Plus = Plus;
  ClipboardList = ClipboardList;
  CheckCircle = CheckCircle;
  MapPin = MapPin;
  Route = Route;
  Package = Package;
  MapPinned = MapPinned;

  // Stats
  todayCalls = 12;
  attendanceStatus = 'Present';
  visitsDone = 8;
  routeCount = 5;
  samplesGiven = 30;

  // DCR
  dcrList = [
    { doctor: 'Dr. Sharma', time: '10:30 AM', status: 'Completed' },
    { doctor: 'Dr. Roy', time: '12:15 PM', status: 'Pending' }
  ];

  // GPS
  lastLocationTime = '10 mins ago';

  // Route
  routePlan = [
    { location: 'Clinic A', time: '10:00 AM' },
    { location: 'Clinic B', time: '12:00 PM' }
  ];

  // Samples
  samples = [
    { product: 'Paracetamol', qty: 10 },
    { product: 'Antibiotic', qty: 5 }
  ];

}