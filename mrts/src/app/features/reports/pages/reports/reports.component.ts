import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';

import {
  FileText,
  AlertCircle,
  User,
  Calendar,
  IndianRupee,
  Download,
  Loader2,
  Users,
  Search,
  Eye,
  X,
  Plus,
  Pencil,
  Save
} from 'lucide-angular';

import Swal from 'sweetalert2';

import { environment } from '../../../../../environments/environment';

// ============================================================
// MODELS
// ============================================================

interface MedicalRepresentative {
  medicalRepresentativeId: number;
  medicalRepresentativeUuid?: string;
  agencyId?: number;
  name: string;
  mobile: string;
  address?: string;
}

interface Customer {
  customerId: number;
  customerUuid?: string | null;
  agencyId?: number;
  name: string;
  mobile: string;
  customerType?: string | null;
  routeName?: string | null;
  isActive?: boolean;
}

interface KmRate {
  id: number;
  agencyId: number;
  rateYear: number;
  rateMonth: number;
  ratePerKm: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ============================================================
// COMPONENT
// ============================================================

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit, OnDestroy {

  // ==========================================================
  // ICONS
  // ==========================================================

  readonly FileText = FileText;
  readonly AlertCircle = AlertCircle;
  readonly User = User;
  readonly Calendar = Calendar;
  readonly IndianRupee = IndianRupee;
  readonly Download = Download;
  readonly Loader2 = Loader2;
  readonly Users = Users;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly X = X;
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Save = Save;

  // ==========================================================
  // API
  // ==========================================================

  private apiUrl = environment.apiUrl;

  // ==========================================================
  // LOCAL STORAGE
  // ==========================================================

  agencyId = 0;

  private rid = '';

  private mid: number | null = null;

  // Special role for MR/customer behavior
  private readonly SPECIAL_RID =
    'fd1c87b5-524a-49e5-b60c-5d7b82ddeb43';

  // Role allowed to ADD / EDIT KM rates
  private readonly KM_RATE_ADMIN_RID =
    'a5fabfee-5506-4e12-bfec-c898fc5af3ae';

  // ==========================================================
  // MR
  // ==========================================================

  mrList: MedicalRepresentative[] = [];

  selectedMrId: number | null = null;

  mrSearchTerm = '';

  private mrSearchSubject =
    new Subject<string>();

  loadingMRs = false;

  // ==========================================================
  // CUSTOMER
  // ==========================================================

  customerList: Customer[] = [];

  selectedCustomerId: number | null = null;

  customerSearchTerm = '';

  private customerSearchSubject =
    new Subject<string>();

  loadingCustomers = false;

  // ==========================================================
  // DATES
  // ==========================================================

  fromDate = '';

  toDate = '';

  // ==========================================================
  // KM RATE
  // ==========================================================

  kmRateList: KmRate[] = [];

  ratePerKm: number | null = null;

  selectedKmRate: KmRate | null = null;

  loadingKmRate = false;

  savingKmRate = false;

  updatingKmRate = false;

  kmRateError = false;

  kmRateMessage = '';

  // Controls Add/Edit section visibility
  showKmRateAdmin = false;

  editingKmRateId: number | null = null;

  editRatePerKm: number | null = null;

  newRatePerKm: number | null = null;

  // ==========================================================
  // PDF
  // ==========================================================

  downloadingVisitPdf = false;

  downloadingMrPdf = false;

  downloadingCustomerPdf = false;

  // ==========================================================
  // ERROR
  // ==========================================================

  errorMessage = '';

  // ==========================================================
  // PREVIEW
  // ==========================================================

  showPreviewModal = false;

  previewUrl: SafeResourceUrl | null = null;

  rawPreviewUrl: string | null = null;

  pendingBlob: Blob | null = null;

  pendingFilename = '';

  previewTitle = '';

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  // ==========================================================
  // SWEETALERT HELPERS
  // ==========================================================

  private showSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563eb'
    });
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc2626'
    });
  }

  private showWarning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#f59e0b'
    });
  }

  private showInfo(message: string): void {
    Swal.fire({
      icon: 'info',
      title: 'Information',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563eb'
    });
  }

  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.setDefaultDates();

    const aid = localStorage.getItem('aid');
    const rid = localStorage.getItem('rid');
    const mid = localStorage.getItem('mid');

    this.agencyId = aid ? Number(aid) : 0;

    this.rid = (rid || '').trim();

    this.mid = mid ? Number(mid) : null;

    this.showKmRateAdmin =
      this.isKmRateAdmin();

    if (this.agencyId <= 0) {

      this.errorMessage =
        'Agency ID not found in localStorage.';

      this.showError(
        this.errorMessage
      );

      return;
    }

    // Load MR
    this.fetchMedicalRepresentatives();

    // Customer is hidden for special role
    if (!this.isSpecialRole()) {
      this.fetchCustomers();
    }

    // Load KM rates
    this.loadKmRates();

    // Apply rate according to From Date
    this.onFromDateChange();

    // MR search
    this.mrSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {

        this.fetchMedicalRepresentatives(
          term
        );

      });

    // Customer search
    this.customerSearchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {

        if (!this.isSpecialRole()) {

          this.fetchCustomers(term);

        }

      });
  }

  // ==========================================================
  // SPECIAL ROLE
  // ==========================================================

  isSpecialRole(): boolean {

    return this.rid.toLowerCase() ===
      this.SPECIAL_RID.toLowerCase();
  }

  // ==========================================================
  // KM RATE ADMIN ROLE
  // ==========================================================

  isKmRateAdmin(): boolean {

    return this.rid.toLowerCase() ===
      this.KM_RATE_ADMIN_RID.toLowerCase();
  }

  // ==========================================================
  // DEFAULT DATE
  // ==========================================================

  private setDefaultDates(): void {

    const today = new Date();

    const firstDay =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

    this.fromDate =
      this.formatDate(firstDay);

    this.toDate =
      this.formatDate(today);
  }

  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  private formatDate(date: Date): string {

    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(date.getDate())
        .padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // ==========================================================
  // DATE CHANGE
  // ==========================================================

  onFromDateChange(): void {

    this.loadSelectedMonthKmRate();
  }

  // ==========================================================
  // LOAD KM RATES
  // ==========================================================

  loadKmRates(): void {

    if (this.agencyId <= 0) {
      return;
    }

    this.loadingKmRate = true;

    this.kmRateError = false;

    this.kmRateMessage = '';

    const params =
      new HttpParams()
        .set(
          'agencyId',
          this.agencyId.toString()
        );

    this.http.get<
      ApiResponse<KmRate[] | KmRate>
    >(
      `${this.apiUrl}/VisitReport/get-km-rate-by-agency`,
      { params }
    )
    .subscribe({

      next: response => {

        this.loadingKmRate = false;

        if (!response.success) {

          this.kmRateList = [];

          this.ratePerKm = null;

          this.selectedKmRate = null;

          this.kmRateError = true;

          this.kmRateMessage =
            response.message ||
            'Unable to load KM rates.';

          return;
        }

        if (Array.isArray(response.data)) {

          this.kmRateList =
            response.data || [];

        } else if (response.data) {

          this.kmRateList =
            [response.data];

        } else {

          this.kmRateList = [];

        }

        this.loadSelectedMonthKmRate();
      },

      error: err => {

        this.loadingKmRate = false;

        this.kmRateList = [];

        this.ratePerKm = null;

        this.selectedKmRate = null;

        this.kmRateError = true;

        this.kmRateMessage =
          'Unable to load KM rate.';

        console.error(
          'KM rate GET error:',
          err
        );
      }
    });
  }

  // ==========================================================
  // FIND RATE FOR SELECTED MONTH
  // ==========================================================

  private loadSelectedMonthKmRate(): void {

    if (!this.fromDate) {

      this.ratePerKm = null;

      this.selectedKmRate = null;

      this.kmRateMessage = '';

      return;
    }

    const parts =
      this.fromDate.split('-');

    if (parts.length !== 3) {
      return;
    }

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    const rate =
      this.kmRateList.find(x =>
        Number(x.rateYear) === year &&
        Number(x.rateMonth) === month &&
        x.isActive !== false
      );

    if (rate) {

      this.selectedKmRate = rate;

      this.ratePerKm =
        Number(rate.ratePerKm);

      this.kmRateError = false;

      this.kmRateMessage =
        `₹${this.ratePerKm.toFixed(2)} / KM`;

    } else {

      this.selectedKmRate = null;

      this.ratePerKm = null;

      this.kmRateError = true;

      this.kmRateMessage =
        `No rate configured for ${this.getMonthName(month)} ${year}.`;
    }
  }

  // ==========================================================
  // ADD KM RATE
  // ==========================================================

  addKmRate(): void {

    if (!this.isKmRateAdmin()) {

      this.showError(
        'You are not authorized to manage KM rates.'
      );

      return;
    }

    if (
      this.newRatePerKm === null ||
      this.newRatePerKm === undefined ||
      Number.isNaN(Number(this.newRatePerKm)) ||
      Number(this.newRatePerKm) < 0
    ) {

      this.showWarning(
        'Please enter a valid Rate Per KM.'
      );

      return;
    }

    if (!this.fromDate) {

      this.showWarning(
        'Please select a From Date.'
      );

      return;
    }

    const parts =
      this.fromDate.split('-');

    if (parts.length !== 3) {

      this.showWarning(
        'Please select a valid From Date.'
      );

      return;
    }

    const rateYear =
      Number(parts[0]);

    const rateMonth =
      Number(parts[1]);

    const alreadyExists =
      this.kmRateList.some(rate =>
        Number(rate.agencyId) === this.agencyId &&
        Number(rate.rateYear) === rateYear &&
        Number(rate.rateMonth) === rateMonth
      );

    if (alreadyExists) {

      this.showWarning(
        `KM Rate already exists for ${this.getMonthName(rateMonth)} ${rateYear}. Please use Edit instead.`
      );

      return;
    }

    const body = {

      agencyId:
        this.agencyId,

      rateYear:
        rateYear,

      rateMonth:
        rateMonth,

      ratePerKm:
        Number(this.newRatePerKm)

    };

    console.log(
      'POST KM RATE BODY:',
      body
    );

    this.savingKmRate = true;

    this.http.post<
      ApiResponse<any>
    >(
      `${this.apiUrl}/VisitReport/post-km-rate`,
      body
    )
    .subscribe({

      next: response => {

        this.savingKmRate = false;

        if (!response.success) {

          this.showError(
            response.message ||
            'Failed to add KM Rate.'
          );

          return;
        }

        this.showSuccess(
          'KM Rate added successfully.'
        );

        this.newRatePerKm = null;

        this.loadKmRates();
      },

      error: err => {

        this.savingKmRate = false;

        console.error(
          'POST KM rate error:',
          err
        );

        this.showError(
          err?.error?.message ||
          'Failed to add KM Rate.'
        );
      }
    });
  }

  // ==========================================================
  // START EDIT
  // ==========================================================

  startEditKmRate(rate: KmRate): void {

    if (!this.isKmRateAdmin()) {

      this.showError(
        'You are not authorized to edit KM rates.'
      );

      return;
    }

    if (!this.canUpdateKmRate(rate)) {

      this.showWarning(
        'KM Rate can be updated only for the current month during the last 10 days of the month.'
      );

      return;
    }

    this.editingKmRateId =
      rate.id;

    this.editRatePerKm =
      Number(rate.ratePerKm);
  }

  // ==========================================================
  // CANCEL EDIT
  // ==========================================================

  cancelEditKmRate(): void {

    this.editingKmRateId = null;

    this.editRatePerKm = null;
  }

  // ==========================================================
  // UPDATE KM RATE
  // ==========================================================

  updateKmRate(rate: KmRate): void {

    if (!this.isKmRateAdmin()) {

      this.showError(
        'You are not authorized to update KM rates.'
      );

      return;
    }

    if (
      this.editRatePerKm === null ||
      this.editRatePerKm === undefined ||
      Number.isNaN(Number(this.editRatePerKm)) ||
      Number(this.editRatePerKm) < 0
    ) {

      this.showWarning(
        'Please enter a valid Rate Per KM.'
      );

      return;
    }

    if (!this.canUpdateKmRate(rate)) {

      this.showWarning(
        'KM Rate can be updated only for the current month during the last 10 days of the month.'
      );

      return;
    }

    this.updatingKmRate = true;

    const body = {

      ratePerKm:
        Number(this.editRatePerKm)

    };

    this.http.put<
      ApiResponse<any>
    >(
      `${this.apiUrl}/VisitReport/update-km-rate/${rate.id}`,
      body
    )
    .subscribe({

      next: response => {

        this.updatingKmRate = false;

        if (!response.success) {

          this.showError(
            response.message ||
            'Failed to update KM Rate.'
          );

          return;
        }

        this.showSuccess(
          'KM Rate updated successfully.'
        );

        this.editingKmRateId = null;

        this.editRatePerKm = null;

        this.loadKmRates();
      },

      error: err => {

        this.updatingKmRate = false;

        console.error(
          'PUT KM rate error:',
          err
        );

        this.showError(
          err?.error?.message ||
          'Failed to update KM Rate.'
        );
      }
    });
  }

  // ==========================================================
  // CHECK UPDATE ALLOWED
  // ==========================================================

  canUpdateKmRate(rate: KmRate): boolean {

    if (!this.isKmRateAdmin()) {
      return false;
    }

    const today =
      new Date();

    const currentYear =
      today.getFullYear();

    const currentMonth =
      today.getMonth() + 1;

    // Must be current month
    if (
      Number(rate.rateYear) !==
        currentYear ||
      Number(rate.rateMonth) !==
        currentMonth
    ) {

      return false;
    }

    const lastDay =
      new Date(
        currentYear,
        currentMonth,
        0
      ).getDate();

    const day =
      today.getDate();

    const firstAllowedDay =
      lastDay - 9;

    return day >= firstAllowedDay;
  }

  // ==========================================================
  // GET CURRENT RATE MONTH
  // ==========================================================

  getSelectedRateMonth(): string {

    if (!this.fromDate) {
      return '';
    }

    const parts =
      this.fromDate.split('-');

    if (parts.length !== 3) {
      return '';
    }

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    return `${this.getMonthName(month)} ${year}`;
  }

  // ==========================================================
  // MONTH NAME
  // ==========================================================

  getMonthName(month: number): string {

    const months = [

      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'

    ];

    return months[month - 1] || '';
  }

  // ==========================================================
  // MR API
  // ==========================================================

  fetchMedicalRepresentatives(
    searchTerm = ''
  ): void {

    this.loadingMRs = true;

    let params =
      new HttpParams()
        .set(
          'agencyId',
          this.agencyId.toString()
        );

    if (searchTerm.trim()) {

      params =
        params.set(
          'search',
          searchTerm.trim()
        );
    }

    this.http.get<
      ApiResponse<MedicalRepresentative[]>
    >(
      `${this.apiUrl}/VisitReport/admin-get-mrlist-active`,
      { params }
    )
    .subscribe({

      next: response => {

        this.loadingMRs = false;

        if (response.success) {

          this.mrList =
            response.data || [];

          // Auto select MID for special role
          if (
            !searchTerm.trim() &&
            this.isSpecialRole() &&
            this.mid !== null
          ) {

            const matched =
              this.mrList.find(
                mr =>
                  Number(
                    mr.medicalRepresentativeId
                  ) === Number(this.mid)
              );

            if (matched) {

              this.selectedMrId =
                matched.medicalRepresentativeId;
            }
          }

        } else {

          this.mrList = [];

          this.errorMessage =
            response.message ||
            'Failed to load MR list.';

          this.showError(
            this.errorMessage
          );
        }
      },

      error: err => {

        this.loadingMRs = false;

        this.mrList = [];

        console.error(
          'MR API error:',
          err
        );

        this.showError(
          err?.error?.message ||
          'Failed to load Medical Representatives.'
        );
      }
    });
  }

  // ==========================================================
  // MR SEARCH
  // ==========================================================

  onMrSearchChange(
    term: string
  ): void {

    if (this.isSpecialRole()) {
      return;
    }

    this.mrSearchSubject.next(term);
  }

  // ==========================================================
  // CUSTOMER API
  // ==========================================================

  fetchCustomers(
    searchTerm = ''
  ): void {

    if (this.isSpecialRole()) {
      return;
    }

    this.loadingCustomers = true;

    const isPhone =
      /^[0-9+\s-]+$/.test(
        searchTerm.trim()
      );

    const body = {

      agencyId:
        this.agencyId,

      assignedAreaManager:
        null,

      isActive:
        true,

      name:
        !isPhone &&
        searchTerm.trim()
          ? searchTerm.trim()
          : null,

      mobile:
        isPhone &&
        searchTerm.trim()
          ? searchTerm.trim()
          : null
    };

    this.http.post<
      ApiResponse<Customer[]>
    >(
      `${this.apiUrl}/VisitReport/customer-list-pdf`,
      body
    )
    .subscribe({

      next: response => {

        this.loadingCustomers = false;

        this.customerList =
          response.success
            ? response.data || []
            : [];

        if (!response.success) {

          console.error(
            'Customer API response:',
            response.message
          );
        }
      },

      error: err => {

        this.loadingCustomers = false;

        this.customerList = [];

        console.error(
          'Customer API error:',
          err
        );

        this.showError(
          err?.error?.message ||
          'Failed to load customers.'
        );
      }
    });
  }

  // ==========================================================
  // CUSTOMER SEARCH
  // ==========================================================

  onCustomerSearchChange(
    term: string
  ): void {

    if (this.isSpecialRole()) {
      return;
    }

    this.customerSearchSubject.next(term);
  }

  // ==========================================================
  // VISIT REPORT PDF
  // ==========================================================

  generateVisitReportPdf(): void {

    if (!this.validateVisitReport()) {
      return;
    }

    this.downloadingVisitPdf = true;

    const params =
      new HttpParams()
        .set(
          'MrId',
          this.selectedMrId!.toString()
        )
        .set(
          'FromDate',
          this.fromDate
        )
        .set(
          'ToDate',
          this.toDate
        )
        .set(
          'RatePerKm',
          this.ratePerKm!.toString()
        );

    this.http.get(
      `${this.apiUrl}/VisitReport/mr-visit-pdf`,
      {
        params,
        responseType: 'blob'
      }
    )
    .subscribe({

      next: blob => {

        this.downloadingVisitPdf = false;

        this.openPdfPreview(
          blob,
          `MR_Visit_Report_${this.selectedMrId}_${this.fromDate}_${this.toDate}.pdf`,
          'Visit Report Preview'
        );
      },

      error: err => {

        this.downloadingVisitPdf = false;

        console.error(
          'Visit PDF error:',
          err
        );

        this.showError(
          'Failed to generate Visit Report PDF.'
        );
      }
    });
  }

  // ==========================================================
  // MR PDF
  // ==========================================================

  generateMrPdf(): void {

    if (
      !this.validateDateRange(
        this.selectedMrId,
        'MR'
      )
    ) {
      return;
    }

    this.downloadingMrPdf = true;

    const params =
      new HttpParams()
        .set(
          'fromDate',
          this.fromDate
        )
        .set(
          'toDate',
          this.toDate
        );

    this.http.get(
      `${this.apiUrl}/VisitReport/mr/${this.selectedMrId}/pdf`,
      {
        params,
        responseType: 'blob'
      }
    )
    .subscribe({

      next: blob => {

        this.downloadingMrPdf = false;

        this.openPdfPreview(
          blob,
          `MR_Report_${this.selectedMrId}_${this.fromDate}_${this.toDate}.pdf`,
          'Medical Representative Report Preview'
        );
      },

      error: err => {

        this.downloadingMrPdf = false;

        console.error(
          'MR PDF error:',
          err
        );

        this.showError(
          'Failed to generate MR PDF.'
        );
      }
    });
  }

  // ==========================================================
  // CUSTOMER PDF
  // ==========================================================

  generateCustomerPdf(): void {

    if (
      !this.validateDateRange(
        this.selectedCustomerId,
        'Customer'
      )
    ) {
      return;
    }

    this.downloadingCustomerPdf = true;

    const params =
      new HttpParams()
        .set(
          'fromDate',
          this.fromDate
        )
        .set(
          'toDate',
          this.toDate
        );

    this.http.get(
      `${this.apiUrl}/VisitReport/customer/${this.selectedCustomerId}/pdf`,
      {
        params,
        responseType: 'blob'
      }
    )
    .subscribe({

      next: blob => {

        this.downloadingCustomerPdf = false;

        this.openPdfPreview(
          blob,
          `Customer_Report_${this.selectedCustomerId}_${this.fromDate}_${this.toDate}.pdf`,
          'Customer Report Preview'
        );
      },

      error: err => {

        this.downloadingCustomerPdf = false;

        console.error(
          'Customer PDF error:',
          err
        );

        this.showError(
          'Failed to generate Customer PDF.'
        );
      }
    });
  }

  // ==========================================================
  // VALIDATE VISIT REPORT
  // ==========================================================

  private validateVisitReport(): boolean {

    if (
      !this.validateDateRange(
        this.selectedMrId,
        'MR'
      )
    ) {

      return false;
    }

    if (
      this.ratePerKm === null ||
      this.ratePerKm < 0
    ) {

      this.showWarning(
        this.kmRateMessage ||
        'KM Rate is not configured for the selected month.'
      );

      return false;
    }

    return true;
  }

  // ==========================================================
  // VALIDATE DATE
  // ==========================================================

  private validateDateRange(
    selectedId: number | null,
    name: string
  ): boolean {

    if (!selectedId) {

      this.showWarning(
        `Please select a ${name}.`
      );

      return false;
    }

    if (!this.fromDate) {

      this.showWarning(
        'Please select From Date.'
      );

      return false;
    }

    if (!this.toDate) {

      this.showWarning(
        'Please select To Date.'
      );

      return false;
    }

    if (
      this.fromDate >
      this.toDate
    ) {

      this.showWarning(
        'From Date cannot be greater than To Date.'
      );

      return false;
    }

    return true;
  }

  // ==========================================================
  // PDF PREVIEW
  // ==========================================================

  private openPdfPreview(
    blob: Blob,
    filename: string,
    title: string
  ): void {

    if (!blob || blob.size === 0) {

      this.showError(
        'Generated PDF is empty.'
      );

      return;
    }

    this.cleanupPreviewUrl();

    this.pendingBlob = blob;

    this.pendingFilename =
      filename;

    this.previewTitle =
      title;

    const pdfBlob =
      new Blob(
        [blob],
        {
          type: 'application/pdf'
        }
      );

    this.rawPreviewUrl =
      URL.createObjectURL(
        pdfBlob
      );

    this.previewUrl =
      this.sanitizer
        .bypassSecurityTrustResourceUrl(
          this.rawPreviewUrl
        );

    this.showPreviewModal = true;
  }

  // ==========================================================
  // DOWNLOAD
  // ==========================================================

  confirmDownload(): void {

    if (
      !this.pendingBlob ||
      !this.pendingFilename
    ) {

      this.showWarning(
        'No PDF is available for download.'
      );

      return;
    }

    const url =
      this.rawPreviewUrl ||
      URL.createObjectURL(
        this.pendingBlob
      );

    const a =
      document.createElement('a');

    a.href = url;

    a.download =
      this.pendingFilename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
  }

  // ==========================================================
  // CLOSE
  // ==========================================================

  closePreviewModal(): void {

    this.showPreviewModal = false;

    this.cleanupPreviewUrl();
  }

  // ==========================================================
  // CLEANUP
  // ==========================================================

  private cleanupPreviewUrl(): void {

    if (this.rawPreviewUrl) {

      URL.revokeObjectURL(
        this.rawPreviewUrl
      );

      this.rawPreviewUrl = null;
    }

    this.previewUrl = null;

    this.pendingBlob = null;

    this.pendingFilename = '';
  }

  // ==========================================================
  // DESTROY
  // ==========================================================

  ngOnDestroy(): void {

    this.cleanupPreviewUrl();

    this.mrSearchSubject.complete();

    this.customerSearchSubject.complete();
  }
}