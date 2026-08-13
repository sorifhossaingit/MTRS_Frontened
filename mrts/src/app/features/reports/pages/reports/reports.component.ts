import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import {
  FileText,
  AlertCircle,
  User,
  Calendar,
  IndianRupee,
  Download,
  FileDown,
  Loader2
} from 'lucide-angular';

import { environment } from '../../../../../environments/environment';

// UPDATED INTERFACE to match the new API response schema
interface MedicalRepresentative {
  medicalRepresentativeId: number;
  medicalRepresentativeUuid?: string;
  agencyId?: number;
  name: string;
  mobile: string;
  address?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: MedicalRepresentative[];
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

  private apiUrl = environment.apiUrl;

  agencyId = 0;
  mrList: MedicalRepresentative[] = [];
  selectedMrId: number | null = null;

  fromDate = '';
  toDate = '';
  ratePerKm: number | null = null;

  loadingMRs = false;
  downloadingVisitPdf = false;
  downloadingMrPdf = false;

  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const aid = localStorage.getItem('aid');
    this.agencyId = aid ? Number(aid) : 0;

    if (this.agencyId > 0) {
      this.fetchMedicalRepresentatives();
    } else {
      this.errorMessage = 'Agency ID not found in localStorage.';
    }
  }

  /**
   * Load Active MR dropdown
   */
  fetchMedicalRepresentatives(): void {
    this.loadingMRs = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('agencyId', this.agencyId.toString());

    // UPDATED ENDPOINT PATH HERE
    this.http.get<ApiResponse>(
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
    if (!this.validateMrReport()) return;

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

  private validateVisitReport(): boolean {
    if (!this.selectedMrId) {
      alert('Please select an MR.');
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
    if (this.ratePerKm === null || this.ratePerKm === undefined || this.ratePerKm < 0) {
      alert('Please enter a valid Rate Per KM.');
      return false;
    }
    return true;
  }

  private validateMrReport(): boolean {
    if (!this.selectedMrId) {
      alert('Please select an MR.');
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