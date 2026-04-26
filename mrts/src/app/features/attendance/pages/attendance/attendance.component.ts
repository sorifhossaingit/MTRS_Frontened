import { Component } from '@angular/core';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Users
} from 'lucide-angular';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {

  // Icons
  CalendarCheck = CalendarCheck;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  Clock = Clock;
  Users = Users;

  // KPI
  totalMR = 25;
  presentCount = 18;
  absentCount = 5;
  lateCount = 2;

  // Filters
  filter: any = {};

  // Data
  mrList = ['Rahul', 'Amit', 'Suresh'];

  attendanceList = [
    {
      date: '26 Apr',
      name: 'Rahul',
      checkIn: '09:30 AM',
      checkOut: '06:00 PM',
      status: 'Present'
    },
    {
      date: '26 Apr',
      name: 'Amit',
      checkIn: '-',
      checkOut: '-',
      status: 'Absent'
    }
  ];

  resetFilter() {
    this.filter = {};
  }
}
