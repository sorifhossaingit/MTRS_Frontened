import { Component, OnInit } from '@angular/core';
import { CalendarCheck, CheckCircle } from 'lucide-angular';
import { MrService } from '../../services/mr.service';

@Component({
  selector: 'app-mr-attendance',
  templateUrl: './mr-attendance.component.html',
  styleUrl: './mr-attendance.component.css'
})
export class MrAttendanceComponent implements OnInit {

  CalendarCheck = CalendarCheck;

  days: any[] = [];

  presentCount = 0;
  absentCount = 0;
  totalDays = 0;

  mrId: number | null = null;

  constructor(private mrService: MrService) {}

  ngOnInit(): void {
    this.mrId = Number(localStorage.getItem('mid')) || null;

    if (this.mrId) {
      this.loadAttendanceSummary();
      this.loadAttendanceData();
    }
  }

  loadAttendanceSummary(): void {
    this.mrService.get_mr_attendance_summary(this.mrId).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.totalDays = res.data.totalDays;
          this.presentCount = res.data.presentDays;
          this.absentCount = res.data.absentDays;
        }
      },
      error: (err) => {
        console.error('Failed to load attendance summary', err);
      }
    });
  }

  loadAttendanceData(): void {
    this.mrService.get_mr_attendance_data(this.mrId).subscribe({
      next: (res: any) => {
        if (res?.success) {

          this.days = res.data.map((item: any) => ({
            fullDate: item.date,
            status: item.status
          }));

        }
      },
      error: (err) => {
        console.error('Failed to load attendance data', err);
      }
    });
  }

  get attendancePercentage(): number {
    if (!this.totalDays) {
      return 0;
    }

    return Math.round((this.presentCount / this.totalDays) * 100);
  }
}
