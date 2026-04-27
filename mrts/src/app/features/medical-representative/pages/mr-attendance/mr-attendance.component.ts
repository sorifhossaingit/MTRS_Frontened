import { Component } from '@angular/core';
import { CalendarCheck, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-mr-attendance',
  templateUrl: './mr-attendance.component.html',
  styleUrl: './mr-attendance.component.css'
})
export class MrAttendanceComponent {

  CalendarCheck = CalendarCheck;
  CheckCircle = CheckCircle;

  today = new Date();
  isTodayMarked = false;

  days: any[] = [];

  presentCount = 0;
  absentCount = 0;
  totalDays = 30;

  constructor() {
    this.generateMonth();
  }

  generateMonth() {
    for (let i = 1; i <= this.totalDays; i++) {
      this.days.push({
        date: i,
        status: Math.random() > 0.5 ? 'Present' : 'Absent'
      });
    }

    this.calculateStats();
  }

  calculateStats() {
    this.presentCount = this.days.filter(d => d.status === 'Present').length;
    this.absentCount = this.days.filter(d => d.status === 'Absent').length;
  }

  markAttendance() {
    const todayDate = this.today.getDate();

    const day = this.days.find(d => d.date === todayDate);

    if (day && !this.isTodayMarked) {
      day.status = 'Present';
      this.isTodayMarked = true;
      this.calculateStats();
    }
  }
}
