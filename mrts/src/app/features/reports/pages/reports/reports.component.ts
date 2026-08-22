import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  FileText,
  AlertCircle,
  User,
  Calendar,
  IndianRupee,
  Download,
  FileDown,
  Loader2,
  Users,
  Search,
  Eye,
  X
} from 'lucide-angular';

import { environment } from '../../../../../environments/environment';

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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit, OnDestroy {

  // Lucide icons
  readonly FileText = FileText;
  readonly AlertCircle = AlertCircle;
  readonly User = User;
  readonly Calendar = Calendar;
  readonly IndianRupee = IndianRupee;
  readonly Download = Download;
  readonly FileDown = FileDown;
  readonly Loader2 = Loader2;
  readonly Users = Users;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly X = X;

  private apiUrl = environment.apiUrl;

  agencyId = 0;

  // MR State
  mrList: MedicalRepresentative[] = [];
  selectedMrId: number | null = null;
  mrSearchTerm = '';
  private mrSearchSubject = new Subject<string>();

  // Customer State
  customerList: Customer[] = [];
  selectedCustomerId: number | null = null;
  customerSearchTerm = '';
  private customerSearchSubject = new Subject<string>();

  // Date & Config Controls (Initialized in ngOnInit)
  fromDate = '';
  toDate = '';
  ratePerKm: number | null = null;

  // Loading States
  loadingMRs = false;
  loadingCustomers = false;
  downloadingVisitPdf = false;
  downloadingMrPdf = false;
  downloadingCustomerPdf = false;

  // Preview Modal States
  showPreviewModal = false;
  previewUrl: SafeResourceUrl | null = null;
  rawPreviewUrl: string | null = null;
  pendingBlob: Blob | null = null;
  pendingFilename = '';
  previewTitle = '';

  errorMessage = '';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Set default dates for current month
    this.setDefaultDates();

    const aid = localStorage.getItem('aid');
    this.agencyId = aid ? Number(aid) : 0;

    if (this.agencyId > 0) {
      this.fetchMedicalRepresentatives();
      this.fetchCustomers();
    } else {
      this.errorMessage = 'Agency ID not found in localStorage.';
    }

    this.mrSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.fetchMedicalRepresentatives(term);
    });

    this.customerSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.fetchCustomers(term);
    });
  }

  /**
   * Sets default dates:
   * fromDate = First day of current month (YYYY-MM-01)
   * toDate = Current day (YYYY-MM-DD)
   */
  private setDefaultDates(): void {
    const today = new Date();
    
    // First day of current month
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = this.formatDateToYYYYMMDD(firstDay);

    // Current date
    this.toDate = this.formatDateToYYYYMMDD(today);
  }

  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnDestroy(): void {
    this.cleanupPreviewUrl();
  }

  fetchMedicalRepresentatives(searchTerm: string = ''): void {
    this.loadingMRs = true;
    this.errorMessage = '';

    let params = new HttpParams().set('agencyId', this.agencyId.toString());

    if (searchTerm.trim()) {
      params = params.set('search', searchTerm.trim());
    }

    this.http.get<ApiResponse<MedicalRepresentative[]>>(
      `${this.apiUrl}/VisitReport/admin-get-mrlist-active`,
      { params }
    ).subscribe({
      next: (response) => {
        this.loadingMRs = false;
        if (response.success) {
          this.mrList = response.data || [];
        } else {
          this.mrList = [];
          this.errorMessage = response.message || 'Failed to fetch MR list.';
        }
      },
      error: (err) => {
        this.loadingMRs = false;
        this.mrList = [];
        this.errorMessage = 'Error fetching MR data. Please try again.';
        console.error('MR dropdown error:', err);
      }
    });
  }

  onMrSearchChange(term: string): void {
    this.mrSearchSubject.next(term);
  }

  fetchCustomers(searchTerm: string = ''): void {
    this.loadingCustomers = true;

    const isPhone = /^[0-9+\s-]+$/.test(searchTerm.trim());

    const body = {
      agencyId: this.agencyId,
      assignedAreaManager: null,
      isActive: true,
      name: !isPhone && searchTerm.trim() ? searchTerm.trim() : null,
      mobile: isPhone && searchTerm.trim() ? searchTerm.trim() : null
    };

    this.http.post<ApiResponse<Customer[]>>(
      `${this.apiUrl}/VisitReport/customer-list-pdf`,
      body
    ).subscribe({
      next: (response) => {
        this.loadingCustomers = false;
        if (response.success) {
          this.customerList = response.data || [];
        } else {
          this.customerList = [];
        }
      },
      error: (err) => {
        this.loadingCustomers = false;
        this.customerList = [];
        console.error('Customer list error:', err);
      }
    });
  }

  onCustomerSearchChange(term: string): void {
    this.customerSearchSubject.next(term);
  }

  generateVisitReportPdf(): void {
    if (!this.validateVisitReport()) return;

    this.downloadingVisitPdf = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('MrId', this.selectedMrId!.toString())
      .set('FromDate', this.fromDate)
      .set('ToDate', this.toDate)
      .set('RatePerKm', this.ratePerKm!.toString());

    this.http.get(
      `${this.apiUrl}/VisitReport/mr-visit-pdf`,
      { params, responseType: 'blob' }
    ).subscribe({
      next: (blob) => {
        this.downloadingVisitPdf = false;
        this.openPdfPreview(
          blob,
          `MR_Visit_Report_${this.selectedMrId}_${this.fromDate}_${this.toDate}.pdf`,
          'Visit Report Preview'
        );
      },
      error: (err) => {
        this.downloadingVisitPdf = false;
        console.error('Visit Report PDF error:', err);
        alert('Failed to generate Visit Report PDF.');
      }
    });
  }

  generateMrPdf(): void {
    if (!this.validateDateRange(this.selectedMrId, 'MR')) return;

    this.downloadingMrPdf = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('fromDate', this.fromDate)
      .set('toDate', this.toDate);

    this.http.get(
      `${this.apiUrl}/VisitReport/mr/${this.selectedMrId}/pdf`,
      { params, responseType: 'blob' }
    ).subscribe({
      next: (blob) => {
        this.downloadingMrPdf = false;
        this.openPdfPreview(
          blob,
          `MR_Report_${this.selectedMrId}_${this.fromDate}_${this.toDate}.pdf`,
          'Medical Representative Report Preview'
        );
      },
      error: (err) => {
        this.downloadingMrPdf = false;
        console.error('MR PDF error:', err);
        alert('Failed to generate MR PDF.');
      }
    });
  }

  generateCustomerPdf(): void {
    if (!this.validateDateRange(this.selectedCustomerId, 'Customer')) return;

    this.downloadingCustomerPdf = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('fromDate', this.fromDate)
      .set('toDate', this.toDate);

    this.http.get(
      `${this.apiUrl}/VisitReport/customer/${this.selectedCustomerId}/pdf`,
      { params, responseType: 'blob' }
    ).subscribe({
      next: (blob) => {
        this.downloadingCustomerPdf = false;
        this.openPdfPreview(
          blob,
          `Customer_Report_${this.selectedCustomerId}_${this.fromDate}_${this.toDate}.pdf`,
          'Customer Report Preview'
        );
      },
      error: (err) => {
        this.downloadingCustomerPdf = false;
        console.error('Customer PDF error:', err);
        alert('Failed to generate Customer PDF.');
      }
    });
  }

  private openPdfPreview(blob: Blob, filename: string, title: string): void {
    if (!blob || blob.size === 0) {
      alert('Generated PDF is empty.');
      return;
    }

    this.cleanupPreviewUrl();

    this.pendingBlob = blob;
    this.pendingFilename = filename;
    this.previewTitle = title;

    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    this.rawPreviewUrl = window.URL.createObjectURL(pdfBlob);
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawPreviewUrl);
    this.showPreviewModal = true;
  }

  confirmDownload(): void {
    if (!this.pendingBlob || !this.pendingFilename) return;

    const anchor = document.createElement('a');
    anchor.href = this.rawPreviewUrl || window.URL.createObjectURL(this.pendingBlob);
    anchor.download = this.pendingFilename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.cleanupPreviewUrl();
  }

  private cleanupPreviewUrl(): void {
    if (this.rawPreviewUrl) {
      window.URL.revokeObjectURL(this.rawPreviewUrl);
      this.rawPreviewUrl = null;
    }
    this.previewUrl = null;
    this.pendingBlob = null;
    this.pendingFilename = '';
  }

  private validateVisitReport(): boolean {
    if (!this.validateDateRange(this.selectedMrId, 'MR')) return false;
    if (this.ratePerKm === null || this.ratePerKm === undefined || this.ratePerKm < 0) {
      alert('Please enter a valid Rate Per KM.');
      return false;
    }
    return true;
  }

  private validateDateRange(selectedId: number | null, entityName: string): boolean {
    if (!selectedId) {
      alert(`Please select a ${entityName}.`);
      return false;
    }
    if (!this.fromDate) {
      alert('Please select From Date.');
      return false;
    }
    if (!this.toDate) {
      alert('Please select To Date.');
      return false;
    }
    if (this.fromDate > this.toDate) {
      alert('From Date cannot be greater than To Date.');
      return false;
    }
    return true;
  }
}