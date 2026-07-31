import { Component, OnInit } from '@angular/core';
import { CalendarCheck, CheckCircle } from 'lucide-angular';
import { MrService } from '../../services/mr.service';
import { switchMap } from 'rxjs/operators';

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
  mrmainidId : number | null = null;
  mrId: number | null = null;

  constructor(private mrService: MrService) {}

ngOnInit(): void {

  this.mrmainidId = Number(localStorage.getItem('mid')) || null;

  if (this.mrmainidId) {
    this.loadAttendanceSummary();
  }

}

loadAttendanceSummary(): void {

  this.mrService
    .getMedicalRepresentativeId(this.mrmainidId!)
    .pipe(
      switchMap((mrRes: any) => {

        // Change according to your API response
        this.mrId = mrRes.userId;

        return this.mrService.get_mr_attendance_summary(this.mrId);

      })
    )
    .subscribe({
      next: (res: any) => {

        if (res.success) {

          this.totalDays = res.data.totalDays;
          this.presentCount = res.data.presentDays;
          this.absentCount = res.data.absentDays;

          // Now mrId has a value
          this.loadAttendanceData();
        }

      },
      error: (err) => {
        console.error(err);
      }
    });
}


loadAttendanceData(): void {

  if (!this.mrId) {
    return;
  }

  this.mrService.get_mr_attendance_data(this.mrId).subscribe({
    next: (res: any) => {

      if (res.success) {

        this.days = res.data.map((item: any) => ({
          fullDate: item.date,
          status: item.status
        }));

      }

    },
    error: (err) => {
      console.error(err);
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
