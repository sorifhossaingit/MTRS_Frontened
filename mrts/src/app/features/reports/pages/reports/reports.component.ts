import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  Search
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
export class ReportsComponent implements OnInit {

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

  // Date & Config Controls
  fromDate = '';
  toDate = '';
  ratePerKm: number | null = null;

  // Loading States
  loadingMRs = false;
  loadingCustomers = false;
  downloadingVisitPdf = false;
  downloadingMrPdf = false;
  downloadingCustomerPdf = false;

  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const aid = localStorage.getItem('aid');
    this.agencyId = aid ? Number(aid) : 0;

    if (this.agencyId > 0) {
      this.fetchMedicalRepresentatives();
      this.fetchCustomers();
    } else {
      this.errorMessage = 'Agency ID not found in localStorage.';
    }

    // Debounce MR search input (300ms delay)
    this.mrSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.fetchMedicalRepresentatives(term);
    });

    // Debounce Customer search input (300ms delay)
    this.customerSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.fetchCustomers(term);
    });
  }

  /**
   * Fetch Active MR dropdown list with optional search term
   */
  fetchMedicalRepresentatives(searchTerm: string = ''): void {
    this.loadingMRs = true;
    this.errorMessage = '';

    let params = new HttpParams().set('agencyId', this.agencyId.toString());

    // ADDED: Set 'search' query param if non-empty
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

  /**
   * Fetch Customer list
   */
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

  /**
   * Generate Visit Report PDF
   */
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
        this.downloadFile(
          blob,
          `MR_Visit_Report_${this.selectedMrId}_${this.fromDate}_${this.toDate}.pdf`
        );
      },
      error: (err) => {
        this.downloadingVisitPdf = false;
        console.error('Visit Report PDF error:', err);
        alert('Failed to download Visit Report PDF.');
      }
    });
  }

  /**
   * Generate MR Monthly/Date Range PDF
   */
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
        this.downloadFile(
          blob,
          `MR_Report_${this.selectedMrId}_${this.fromDate}_${this.toDate}.pdf`
        );
      },
      error: (err) => {
        this.downloadingMrPdf = false;
        console.error('MR PDF error:', err);
        alert('Failed to download MR PDF.');
      }
    });
  }

  /**
   * Generate Customer PDF
   */
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
        this.downloadFile(
          blob,
          `Customer_Report_${this.selectedCustomerId}_${this.fromDate}_${this.toDate}.pdf`
        );
      },
      error: (err) => {
        this.downloadingCustomerPdf = false;
        console.error('Customer PDF error:', err);
        alert('Failed to download Customer PDF.');
      }
    });
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

  private downloadFile(blob: Blob, filename: string): void {
    if (!blob || blob.size === 0) {
      alert('Generated PDF is empty.');
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}