import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

interface MedicalRepresentative {
  medicalRepresentativeId: number;
  medicalRepresentativeUuid: string;
  agencyId: number;
  name: string;
  mobile: string;
  address: string;
}

interface VisitExpenseReport {
  reportId: number;
  mrId?: number;
  mrName?: string;
  mrMobile?: string;
  mrEmail?: string;
  mrRegion?: string;
  mrCoverArea?: string;
  assignedAreaManager?: string;
  reportMonth?: number;
  reportYear?: number;
  reportStartDate?: string;
  reportEndDate?: string;
  reportType?: string;
  closureDate?: string;
  closureReason?: string;
  reportStatus?: string;
  generatedAt?: string;
  generatedBy?: number;
  decisionBy?: number;
  decisionByName?: string;
  decisionAt?: string;
  rejectionReason?: string;
  canDecide?: boolean;
  totalDistanceKm?: number;
  ratePerKm?: number;
  totalExpense?: number;
  totalPlans?: number;
  totalVisits?: number;
  completedVisits?: number;
  [key: string]: any;
}

interface CreateMonthlyReportRequest {
  mrId: number;
  reportMonth: number;
  reportYear: number;
  reportType: string;
  closureDate: string | null;
  closureReason: string;
  ratePerKm: number;
}

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.css'
})
export class MonthlyReportComponent implements OnInit, OnDestroy {
  private readonly apiUrl = 'https://localhost:7078/api/v1/VisitReport';
  private subscriptions: Subscription[] = [];
  private currentObjectUrl: string | null = null;

  currentDate = new Date();
  selectedMonth = this.currentDate.getMonth() + 1;
  selectedYear = this.currentDate.getFullYear();
  years: number[] = [];

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

  selectedStatus = 'pending';
statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: '', label: 'All Reports' }
];

  reports: VisitExpenseReport[] = [];
  selectedReport: VisitExpenseReport | null = null;

  showCreateForm = false;
  createRequest: CreateMonthlyReportRequest = {
    mrId: 0,
    reportMonth: this.selectedMonth,
    reportYear: this.selectedYear,
    reportType: 'NORMAL',
    closureDate: null,
    closureReason: '',
    ratePerKm: 0
  };

  // MR Search Dropdown Properties
  agencyId = 0; // Configure your active agency ID dynamically if needed
  mrList: MedicalRepresentative[] = [];
  selectedMr: MedicalRepresentative | null = null;
  isMrDropdownOpen = false;
  loadingMrList = false;
  mrSearchQuery = '';
  private searchSubject = new Subject<string>();

  reportTypes = [
    { value: 'NORMAL', label: 'Normal Monthly' },
    { value: 'EARLY_CLOSURE', label: 'Early Closure' }
  ];

  loadingReports = false;
  creatingReport = false;
  loadingReportDetails = false;
  approving = false;
  rejecting = false;
  downloading = false;

  successMessage = '';
  errorMessage = '';

  showPreviewModal = false;
  previewUrl: SafeResourceUrl | null = null;
  previewLoading = false;

  showApproveModal = false;
  approveRemarks = '';

  showRejectModal = false;
  rejectionReason = '';

  mrIdFromStorage: number | null = null;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    const storedAgencyId = localStorage.getItem('aid');
    const storedRoleId = localStorage.getItem('rid');
    const storedMrId = localStorage.getItem('mrId'); // Ensure 'mrId' or relevant key is saved in localStorage

    if (storedAgencyId) {
      this.agencyId = Number(storedAgencyId);
    }

    // Capture MR ID if the role ID matches
    if (storedRoleId === 'a5fabfee-5506-4e12-bfec-c898fc5af3ae' && storedMrId) {
      this.mrIdFromStorage = Number(storedMrId);
    }
  }

  this.buildYears();
  this.createRequest.reportMonth = this.selectedMonth;
  this.createRequest.reportYear = this.selectedYear;

  this.loadReports();
  this.setupMrSearchSubscription();
}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.revokePreviewUrl();
  }

  private buildYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear - 3; year <= currentYear + 1; year++) {
      this.years.push(year);
    }
  }

  // Set up debounced real-time MR search
  private setupMrSearchSubscription(): void {
    const sub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        this.loadingMrList = true;
        return this.fetchMrListApi(searchTerm).pipe(
          catchError(() => {
            this.loadingMrList = false;
            return of([]);
          })
        );
      })
    ).subscribe(data => {
      this.loadingMrList = false;
      this.mrList = data;
    });

    this.subscriptions.push(sub);
  }

  private fetchMrListApi(search: string = '') {
    let params = new HttpParams().set('agencyId', String(this.agencyId));
    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }

    return this.http.get<any>(`${this.apiUrl}/admin-get-mrlist-active`, { params }).pipe(
      switchMap(res => {
        if (res && res.success && Array.isArray(res.data)) {
          return of(res.data as MedicalRepresentative[]);
        }
        return of([]);
      })
    );
  }

  fetchMrList(searchQuery: string = ''): void {
    this.searchSubject.next(searchQuery);
  }

  onMrSearchInput(event: Event): void {
    const inputVal = (event.target as HTMLInputElement).value;
    this.mrSearchQuery = inputVal;
    this.fetchMrList(inputVal);
  }

  toggleMrDropdown(): void {
    this.isMrDropdownOpen = !this.isMrDropdownOpen;
    if (this.isMrDropdownOpen && this.mrList.length === 0) {
      this.fetchMrList('');
    }
  }

  selectMr(mr: MedicalRepresentative): void {
    this.selectedMr = mr;
    this.createRequest.mrId = mr.medicalRepresentativeId;
    this.isMrDropdownOpen = false;
    this.mrSearchQuery = '';
  }

  clearSelectedMr(event: MouseEvent): void {
    event.stopPropagation();
    this.selectedMr = null;
    this.createRequest.mrId = 0;
    this.fetchMrList('');
  }
loadReports(): void {
  this.clearMessages();
  this.loadingReports = true;

  let params = new HttpParams()
    .set('month', String(this.selectedMonth))
    .set('year', String(this.selectedYear))
    .set('status', this.selectedStatus);

  // Check role ID directly from localStorage (or component state)
  const roleId = isPlatformBrowser(this.platformId) ? localStorage.getItem('rid') : null;
  const storedMrId = isPlatformBrowser(this.platformId) ? localStorage.getItem('mrId') : null;

  // Append mrId ONLY if status is NOT 'all' AND role ID matches the specified UUID
  if (
    this.selectedStatus !== 'all' && 
    roleId === 'a5fabfee-5506-4e12-bfec-c898fc5af3ae' && 
    storedMrId
  ) {
    params = params.set('mrId', String(storedMrId));
  }

  const sub = this.http.get<any>(`${this.apiUrl}/admin`, { params }).subscribe({
    next: response => {
      this.loadingReports = false;
      if (response && Array.isArray(response.data)) {
        this.reports = response.data;
      } else if (Array.isArray(response)) {
        this.reports = response;
      } else {
        this.reports = [];
      }
    },
    error: error => {
      this.loadingReports = false;
      this.reports = [];
      this.errorMessage = this.getApiErrorMessage(error, 'Unable to load visit expense reports.');
    }
  });

  this.subscriptions.push(sub);
}
  onFilterChange(): void {
    this.loadReports();
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.clearMessages();
    if (this.showCreateForm) {
      this.createRequest.reportMonth = this.selectedMonth;
      this.createRequest.reportYear = this.selectedYear;
      this.fetchMrList('');
    }
  }

  onReportTypeChange(): void {
    if (this.createRequest.reportType !== 'EARLY_CLOSURE') {
      this.createRequest.closureDate = null;
      this.createRequest.closureReason = '';
    }
  }

  createMonthlyReport(): void {
    this.clearMessages();

    if (!this.createRequest.mrId || Number(this.createRequest.mrId) <= 0) {
      this.errorMessage = 'Please select a Medical Representative.';
      return;
    }

    if (!this.createRequest.reportMonth || this.createRequest.reportMonth < 1 || this.createRequest.reportMonth > 12) {
      this.errorMessage = 'Please select a valid report month.';
      return;
    }

    if (!this.createRequest.reportYear || this.createRequest.reportYear < 2000) {
      this.errorMessage = 'Please select a valid report year.';
      return;
    }

    if (this.createRequest.ratePerKm === null || this.createRequest.ratePerKm === undefined || Number(this.createRequest.ratePerKm) <= 0) {
      this.errorMessage = 'Please enter a valid rate per KM.';
      return;
    }

    if (this.createRequest.reportType === 'EARLY_CLOSURE') {
      if (!this.createRequest.closureDate) {
        this.errorMessage = 'Closure date is required for early closure.';
        return;
      }

      if (!this.createRequest.closureReason || !this.createRequest.closureReason.trim()) {
        this.errorMessage = 'Closure reason is required for early closure.';
        return;
      }
    }

    const payload = {
      mrId: Number(this.createRequest.mrId),
      reportMonth: Number(this.createRequest.reportMonth),
      reportYear: Number(this.createRequest.reportYear),
      reportType: this.createRequest.reportType,
      closureDate: this.createRequest.closureDate ? new Date(this.createRequest.closureDate).toISOString() : null,
      closureReason: this.createRequest.closureReason?.trim() || '',
      ratePerKm: Number(this.createRequest.ratePerKm)
    };

    this.creatingReport = true;

    const sub = this.http.post<any>(`${this.apiUrl}/monthly`, payload).subscribe({
      next: response => {
        this.creatingReport = false;
        this.successMessage = response?.message || 'Monthly visit expense report created successfully.';
        this.showCreateForm = false;
        this.resetCreateForm();
        this.loadReports();
      },
      error: error => {
        this.creatingReport = false;
        this.errorMessage = this.getApiErrorMessage(error, 'Unable to create monthly report.');
      }
    });

    this.subscriptions.push(sub);
  }

  resetCreateForm(): void {
    this.createRequest = {
      mrId: 0,
      reportMonth: this.selectedMonth,
      reportYear: this.selectedYear,
      reportType: 'NORMAL',
      closureDate: null,
      closureReason: '',
      ratePerKm: 0
    };
    this.selectedMr = null;
    this.mrSearchQuery = '';
    this.isMrDropdownOpen = false;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  closeSuccess(): void {
    this.successMessage = '';
  }

  closeError(): void {
    this.errorMessage = '';
  }

  private getApiErrorMessage(error: any, fallback: string): string {
    if (error?.error?.message) return error.error.message;
    if (error?.message) return error.message;
    return fallback;
  }

  previewReport(report?: VisitExpenseReport | number): void {
    let id: number | undefined;
    if (typeof report === 'number') {
      id = report;
    } else {
      id = report?.reportId || this.selectedReport?.reportId;
    }

    if (!id) return;

    this.clearMessages();
    this.previewLoading = true;
    this.showPreviewModal = true;
    this.revokePreviewUrl();

    const sub = this.http.get(`${this.apiUrl}/${id}/preview`, { responseType: 'blob' }).subscribe({
      next: blob => {
        this.previewLoading = false;
        this.currentObjectUrl = window.URL.createObjectURL(blob);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentObjectUrl);
      },
      error: error => {
        this.previewLoading = false;
        this.showPreviewModal = false;
        this.errorMessage = this.getApiErrorMessage(error, 'Unable to load PDF preview.');
      }
    });

    this.subscriptions.push(sub);
  }

  closePreview(): void {
    this.showPreviewModal = false;
    this.previewLoading = false;
    this.revokePreviewUrl();
  }

  private revokePreviewUrl(): void {
    if (this.currentObjectUrl) {
      window.URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
    this.previewUrl = null;
  }

  canDecide(report: VisitExpenseReport | null): boolean {
    if (!report) return false;
    const status = (report.reportStatus || '').toLowerCase();

    if (status !== 'pending') return false;
    if (report.canDecide === true) return true;

    if (report.reportEndDate) {
      const end = new Date(report.reportEndDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return today > end;
    }

    return false;
  }

  canApprove(report: VisitExpenseReport): boolean {
    return this.canDecide(report);
  }

  canReject(report: VisitExpenseReport): boolean {
    return this.canDecide(report);
  }

  openApproveModal(report?: VisitExpenseReport): void {
    if (report) this.selectedReport = report;
    if (!this.selectedReport) return;

    if (!this.canDecide(this.selectedReport)) {
      this.errorMessage = 'This report is not eligible for approval yet.';
      return;
    }

    this.approveRemarks = '';
    this.showApproveModal = true;
  }

  closeApproveModal(): void {
    if (this.approving) return;
    this.showApproveModal = false;
    this.approveRemarks = '';
  }

  openRejectModal(report?: VisitExpenseReport): void {
    if (report) this.selectedReport = report;
    if (!this.selectedReport) return;

    if (!this.canDecide(this.selectedReport)) {
      this.errorMessage = 'This report is not eligible for rejection yet.';
      return;
    }

    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    if (this.rejecting) return;
    this.showRejectModal = false;
    this.rejectionReason = '';
  }

  approveReport(): void {
    if (!this.selectedReport) return;

    if (!this.canDecide(this.selectedReport)) {
      this.errorMessage = 'This report is not eligible for approval yet.';
      return;
    }

    this.approving = true;
    const reportId = this.selectedReport.reportId;
    const payload = { remarks: this.approveRemarks?.trim() || '' };

    const sub = this.http.post<any>(`${this.apiUrl}/${reportId}/approve`, payload).subscribe({
      next: response => {
        this.approving = false;
        this.showApproveModal = false;
        this.approveRemarks = '';
        this.successMessage = response?.message || 'Report approved successfully.';
        this.loadReports();
      },
      error: error => {
        this.approving = false;
        this.errorMessage = this.getApiErrorMessage(error, 'Unable to approve report.');
      }
    });

    this.subscriptions.push(sub);
  }

  rejectReport(): void {
    if (!this.selectedReport) return;

    if (!this.canDecide(this.selectedReport)) {
      this.errorMessage = 'This report is not eligible for rejection yet.';
      return;
    }

    if (!this.rejectionReason || !this.rejectionReason.trim()) {
      this.errorMessage = 'Rejection reason is required.';
      return;
    }

    this.rejecting = true;
    const reportId = this.selectedReport.reportId;
    const payload = { rejectionReason: this.rejectionReason.trim() };

    const sub = this.http.post<any>(`${this.apiUrl}/${reportId}/reject`, payload).subscribe({
      next: response => {
        this.rejecting = false;
        this.showRejectModal = false;
        this.rejectionReason = '';
        this.successMessage = response?.message || 'Report rejected successfully.';
        this.loadReports();
      },
      error: error => {
        this.rejecting = false;
        this.errorMessage = this.getApiErrorMessage(error, 'Unable to reject report.');
      }
    });

    this.subscriptions.push(sub);
  }

  getMonthName(monthValue?: number): string {
    const found = this.months.find(m => m.value === monthValue);
    return found ? found.name : '-';
  }

  formatCurrency(val?: number): string {
    if (val === null || val === undefined) return '₹0.00';
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatNumber(val?: number): string {
    if (val === null || val === undefined) return '0';
    return val.toLocaleString('en-IN');
  }

  getStatusClass(status?: string): string {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'approved':
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
      case 'rejected':
        return 'border-red-200 bg-red-50 text-red-700';
      case 'pending':
      default:
        return 'border-amber-200 bg-amber-50 text-amber-700';
    }
  }

  getStatusLabel(status?: string): string {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
}