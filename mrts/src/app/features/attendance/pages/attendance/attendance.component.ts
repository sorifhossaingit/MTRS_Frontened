import { Component, OnInit } from '@angular/core';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  UserCheck
} from 'lucide-angular';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {

  // Icons
  CalendarCheck = CalendarCheck;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  Clock = Clock;
  Users = Users;
  UserCheck = UserCheck;

  agencyId = Number(localStorage.getItem('aid'));
  areaManagerId = Number(localStorage.getItem('mid'));

  // KPI
  totalMR = 0;
  activeMR = 0;
  presentCount = 0;
  absentCount = 0;

  // Filters
  filter: any = {
    date: new Date().toISOString().split('T')[0],
    status: '',
    name: '',
    mobile: '',
    email: ''
  };

  // Table Data
  attendanceList: any[] = [];

  // Pagination
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  constructor(
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadAttendanceList();
  }

  // =========================
  // Dashboard KPI
  // =========================

  loadDashboard(): void {

    const payload = {
      agencyId: this.agencyId,
      areaManagerId: this.areaManagerId
    };

    this.attendanceService
      .get_attendance_dashboard(payload)
      .subscribe({
        next: (res: any) => {

          if (res.success) {

            this.totalMR =
              res.data.totalMedicalRepresentatives || 0;

            this.activeMR =
              res.data.activeMedicalRepresentatives || 0;

            this.presentCount =
              res.data.presentMedicalRepresentatives || 0;

            this.absentCount =
              res.data.absentMedicalRepresentatives || 0;
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  // =========================
  // Attendance List
  // =========================

  loadAttendanceList(): void {

    const payload = {
      agencyId: this.agencyId,
      areaManagerId: this.areaManagerId,
      date: this.filter.date
        ? new Date(this.filter.date).toISOString()
        : null,
      status: this.filter.status || null,
      name: this.filter.name || null,
      mobile: this.filter.mobile || null,
      email: this.filter.email || null,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.attendanceService
      .get_attendance_list(payload)
      .subscribe({
        next: (res: any) => {

          if (res.success) {

            this.attendanceList = res.data || [];

            this.totalRecords =
              res.totalRecords || 0;

            this.pageNumber =
              res.pageNumber || 1;

            this.pageSize =
              res.pageSize || 10;

            this.totalPages = Math.ceil(
              this.totalRecords / this.pageSize
            );
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  // =========================
  // Filters
  // =========================

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadAttendanceList();
  }

  resetFilter(): void {

    this.filter = {
      date: new Date().toISOString().split('T')[0],
      status: '',
      name: '',
      mobile: '',
      email: ''
    };

    this.pageNumber = 1;

    this.loadAttendanceList();
  }

  // =========================
  // Pagination
  // =========================

  nextPage(): void {

    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadAttendanceList();
    }
  }

  previousPage(): void {

    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadAttendanceList();
    }
  }

  changePageSize(size: number): void {

    this.pageSize = size;
    this.pageNumber = 1;

    this.loadAttendanceList();
  }

  getSerial(index: number): number {
    return ((this.pageNumber - 1) * this.pageSize) + index + 1;
  }

  formatDate(date: string): string {

    if (!date) return '-';

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  formatTime(dateTime: string): string {

    if (!dateTime) return '-';

    return new Date(dateTime).toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }
}
