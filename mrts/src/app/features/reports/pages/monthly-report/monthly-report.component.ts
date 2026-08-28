
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import {
  Subscription,
  Subject,
  of
} from 'rxjs';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError
} from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';


// =========================================================
// MEDICAL REPRESENTATIVE
// =========================================================

interface MedicalRepresentative {
  medicalRepresentativeId: number;
  medicalRepresentativeUuid: string;
  agencyId: number;
  name: string;
  mobile: string;
  address: string;
}


// =========================================================
// VISIT EXPENSE REPORT
// =========================================================

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


// =========================================================
// CREATE MONTHLY REPORT REQUEST
// =========================================================

interface CreateMonthlyReportRequest {
  mrId: number;
  reportMonth: number;
  reportYear: number;
  reportType: string;
  closureDate: string | null;
  closureReason: string;
  ratePerKm: number;
}


// =========================================================
// KM RATE
// =========================================================

interface KmRate {
  id: number;
  agencyId: number;
  rateYear: number;
  rateMonth: number;
  ratePerKm: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}


// =========================================================
// COMPONENT
// =========================================================

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrl: './monthly-report.component.css'
})
export class MonthlyReportComponent
  implements OnInit, OnDestroy {


  // =======================================================
  // API
  // =======================================================

  private readonly apiUrl =
    'https://localhost:7078/api/v1/VisitReport';


  // =======================================================
  // ROLE IDs
  // =======================================================

  /**
   * MR ROLE
   *
   * Can:
   * - Create report
   * - Approve
   * - Reject
   */
  readonly ROLE_MR =
    'a5fabfee-5506-4e12-bfec-c898fc5af3ae';


  /**
   * SECOND ROLE
   *
   * Can:
   * - Create report
   *
   * Cannot:
   * - Approve
   * - Reject
   */
  readonly ROLE_CREATE =
    '11714ca6-4cdb-46c5-bb12-d582ef179bc2';


  /**
   * MR VIEW ROLE
   *
   * Can:
   * - View own reports
   *
   * API must receive:
   * mrId from localStorage
   *
   * Cannot:
   * - Create
   * - Approve
   * - Reject
   */
  readonly ROLE_MR_VIEW =
    'fd1c87b5-524a-49e5-b60c-5d7b82ddeb43';


  // =======================================================
  // CURRENT USER ROLE
  // =======================================================

  roleId = '';


  // =======================================================
  // AGENCY ID
  // =======================================================

  /**
   * Comes from:
   *
   * localStorage.getItem('aid')
   */
  agencyId = 0;


  // =======================================================
  // MR ID FROM LOCAL STORAGE
  // =======================================================

  /**
   * Comes from:
   *
   * localStorage.getItem('mrId')
   */
  mrIdFromStorage: number | null = null;


  // =======================================================
  // SUBSCRIPTIONS
  // =======================================================

  private subscriptions: Subscription[] = [];


  // =======================================================
  // PDF OBJECT URL
  // =======================================================

  private currentObjectUrl: string | null = null;


  // =======================================================
  // CURRENT DATE
  // =======================================================

  currentDate = new Date();


  // =======================================================
  // FILTER MONTH / YEAR
  // =======================================================

  selectedMonth =
    this.currentDate.getMonth() + 1;

  selectedYear =
    this.currentDate.getFullYear();


  years: number[] = [];


  // =======================================================
  // MONTHS
  // =======================================================

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


  // =======================================================
  // STATUS
  // =======================================================

  selectedStatus = 'pending';

  statusOptions = [
    {
      value: 'pending',
      label: 'Pending'
    },
    {
      value: 'approved',
      label: 'Approved'
    },
    {
      value: 'rejected',
      label: 'Rejected'
    },
    {
      value: '',
      label: 'All Reports'
    }
  ];


  // =======================================================
  // REPORTS
  // =======================================================

  reports: VisitExpenseReport[] = [];

  selectedReport:
    VisitExpenseReport | null = null;


  // =======================================================
  // CREATE FORM
  // =======================================================

  showCreateForm = false;

  createRequest:
    CreateMonthlyReportRequest = {

      mrId: 0,

      reportMonth:
        this.selectedMonth,

      reportYear:
        this.selectedYear,

      reportType:
        'NORMAL',

      closureDate:
        null,

      closureReason:
        '',

      ratePerKm:
        0
    };


  // =======================================================
  // KM RATES
  // =======================================================

  kmRates: KmRate[] = [];

  loadingKmRate = false;


  // =======================================================
  // MR SEARCH
  // =======================================================

  mrList:
    MedicalRepresentative[] = [];

  selectedMr:
    MedicalRepresentative | null = null;

  isMrDropdownOpen = false;

  loadingMrList = false;

  mrSearchQuery = '';


  private searchSubject =
    new Subject<string>();


  // =======================================================
  // REPORT TYPES
  // =======================================================

  reportTypes = [
    {
      value: 'NORMAL',
      label: 'Normal Monthly'
    },
    {
      value: 'EARLY_CLOSURE',
      label: 'Early Closure'
    }
  ];


  // =======================================================
  // LOADING STATES
  // =======================================================

  loadingReports = false;

  creatingReport = false;

  loadingReportDetails = false;

  approving = false;

  rejecting = false;

  downloading = false;


  // =======================================================
  // MESSAGES
  // =======================================================

  successMessage = '';

  errorMessage = '';


  // =======================================================
  // PDF PREVIEW
  // =======================================================

  showPreviewModal = false;

  previewUrl:
    SafeResourceUrl | null = null;

  previewLoading = false;


  // =======================================================
  // APPROVE
  // =======================================================

  showApproveModal = false;

  approveRemarks = '';


  // =======================================================
  // REJECT
  // =======================================================

  showRejectModal = false;

  rejectionReason = '';


  // =======================================================
  // CONSTRUCTOR
  // =======================================================

  constructor(
    private http: HttpClient,

    private sanitizer:
      DomSanitizer,

    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {}


  // =======================================================
  // INIT
  // =======================================================

  ngOnInit(): void {

    // =====================================================
    // LOAD LOCAL STORAGE VALUES
    // =====================================================

    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {

      this.loadUserRoleFromStorage();

      this.loadAgencyIdFromStorage();
    }


    // =====================================================
    // BUILD YEARS
    // =====================================================

    this.buildYears();


    // =====================================================
    // SET INITIAL CREATE PERIOD
    // =====================================================

    this.createRequest.reportMonth =
      this.selectedMonth;

    this.createRequest.reportYear =
      this.selectedYear;


    // =====================================================
    // LOAD KM RATE
    // =====================================================

    this.loadKmRates();


    // =====================================================
    // LOAD REPORTS
    // =====================================================

    this.loadReports();


    // =====================================================
    // MR SEARCH
    // =====================================================

    this.setupMrSearchSubscription();
  }


  // =======================================================
  // DESTROY
  // =======================================================

  ngOnDestroy(): void {

    this.subscriptions.forEach(
      sub => sub.unsubscribe()
    );

    this.revokePreviewUrl();
  }


  // =======================================================
  // LOAD AGENCY ID
  // =======================================================

  private loadAgencyIdFromStorage(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }


    const storedAgencyId =
      localStorage.getItem('aid');


    if (!storedAgencyId) {

      this.agencyId = 0;

      console.error(
        'Agency ID not found in localStorage.'
      );

      return;
    }


    const parsedAgencyId =
      Number(storedAgencyId);


    if (
      Number.isInteger(parsedAgencyId) &&
      parsedAgencyId > 0
    ) {

      this.agencyId =
        parsedAgencyId;

    } else {

      this.agencyId = 0;

      console.error(
        'Invalid agency ID:',
        storedAgencyId
      );
    }


    console.log(
      'Agency ID:',
      this.agencyId
    );
  }


  // =======================================================
  // LOAD USER ROLE + MR ID
  // =======================================================

  private loadUserRoleFromStorage(): void {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }


    const storedRoleId =
      localStorage.getItem('rid');


    const storedMrId =
      localStorage.getItem('mid');


    // =====================================================
    // ROLE
    // =====================================================

    this.roleId =
      storedRoleId
        ?.trim()
        .toLowerCase() || '';


    // =====================================================
    // MR ID
    // =====================================================

    if (storedMrId) {

      const parsedMrId =
        Number(storedMrId);


      if (
        Number.isInteger(parsedMrId) &&
        parsedMrId > 0
      ) {

        this.mrIdFromStorage =
          parsedMrId;

      } else {

        this.mrIdFromStorage =
          null;
      }

    } else {

      this.mrIdFromStorage =
        null;
    }


    console.log(
      'Role ID:',
      this.roleId
    );

    console.log(
      'MR ID:',
      this.mrIdFromStorage
    );
  }


  // =======================================================
  // CREATE REPORT PERMISSION
  // =======================================================

  canCreateReport(): boolean {

    return (
      this.roleId === this.ROLE_MR ||
      this.roleId === this.ROLE_CREATE
    );
  }


  // =======================================================
  // APPROVE / REJECT PERMISSION
  // =======================================================

  canApproveReject(): boolean {

    return (
      this.roleId === this.ROLE_MR
    );
  }


  // =======================================================
  // IS MR ROLE
  // =======================================================

  isMrRole(): boolean {

    return (
      this.roleId === this.ROLE_MR
    );
  }


  // =======================================================
  // IS MR VIEW ROLE
  // =======================================================

  isMrViewRole(): boolean {

    return (
      this.roleId === this.ROLE_MR_VIEW
    );
  }


  // =======================================================
  // BUILD YEARS
  // =======================================================

  private buildYears(): void {

    const currentYear =
      new Date().getFullYear();


    this.years = [];


    for (
      let year = currentYear - 3;
      year <= currentYear + 1;
      year++
    ) {

      this.years.push(year);
    }
  }


  // =======================================================
  // LOAD KM RATES
  // =======================================================

  loadKmRates(): void {

    if (
      !this.agencyId ||
      this.agencyId <= 0
    ) {

      console.error(
        'Cannot load KM rate. Invalid agencyId.'
      );

      this.kmRates = [];

      this.createRequest.ratePerKm = 0;

      return;
    }


    this.loadingKmRate = true;


    const params =
      new HttpParams()
        .set(
          'agencyId',
          String(this.agencyId)
        );


    const sub =
      this.http
        .get<any>(
          `${this.apiUrl}/get-km-rate-by-agency`,
          {
            params
          }
        )
        .subscribe({

          next: response => {

            this.loadingKmRate =
              false;


            if (
              response?.success &&
              Array.isArray(response.data)
            ) {

              this.kmRates =
                response.data as KmRate[];


              console.log(
                'KM Rates:',
                this.kmRates
              );


              this.setRateForSelectedPeriod();

            } else {

              this.kmRates = [];

              this.createRequest.ratePerKm =
                0;
            }
          },


          error: error => {

            this.loadingKmRate =
              false;

            this.kmRates = [];

            this.createRequest.ratePerKm =
              0;


            console.error(
              'KM Rate API Error:',
              error
            );


            this.errorMessage =
              this.getApiErrorMessage(
                error,
                'Unable to load rate per KM.'
              );
          }

        });


    this.subscriptions.push(sub);
  }


  // =======================================================
  // SET RATE FOR SELECTED MONTH / YEAR
  // =======================================================

  private setRateForSelectedPeriod(): void {

    const month =
      Number(
        this.createRequest.reportMonth
      );


    const year =
      Number(
        this.createRequest.reportYear
      );


    const rate =
      this.kmRates.find(
        item =>

          Number(item.rateMonth) === month &&

          Number(item.rateYear) === year &&

          item.isActive === true
      );


    if (rate) {

      this.createRequest.ratePerKm =
        Number(rate.ratePerKm);


      console.log(
        `Rate for ${month}/${year}:`,
        this.createRequest.ratePerKm
      );

    } else {

      this.createRequest.ratePerKm =
        0;


      console.warn(
        `No active KM rate found for ${month}/${year}`
      );
    }
  }


  // =======================================================
  // CREATE MONTH CHANGE
  // =======================================================

  onCreateMonthChange(): void {

    this.setRateForSelectedPeriod();
  }


  // =======================================================
  // CREATE YEAR CHANGE
  // =======================================================

  onCreateYearChange(): void {

    this.setRateForSelectedPeriod();
  }


  // =======================================================
  // SETUP MR SEARCH
  // =======================================================

  private setupMrSearchSubscription(): void {

    const sub =
      this.searchSubject
        .pipe(

          debounceTime(300),

          distinctUntilChanged(),

          switchMap(
            searchTerm => {

              this.loadingMrList =
                true;


              return this
                .fetchMrListApi(
                  searchTerm
                )
                .pipe(

                  catchError(
                    () => {

                      this.loadingMrList =
                        false;

                      return of([]);
                    }
                  )

                );
            }
          )

        )
        .subscribe(data => {

          this.loadingMrList =
            false;

          this.mrList =
            data;
        });


    this.subscriptions.push(sub);
  }


  // =======================================================
  // FETCH MR API
  // =======================================================

  private fetchMrListApi(
    search: string = ''
  ) {

    let params =
      new HttpParams()
        .set(
          'agencyId',
          String(this.agencyId)
        );


    if (
      search &&
      search.trim()
    ) {

      params =
        params.set(
          'search',
          search.trim()
        );
    }


    return this.http
      .get<any>(
        `${this.apiUrl}/admin-get-mrlist-active`,
        {
          params
        }
      )
      .pipe(

        switchMap(res => {

          if (
            res?.success &&
            Array.isArray(res.data)
          ) {

            return of(
              res.data as MedicalRepresentative[]
            );
          }


          return of([]);
        })

      );
  }


  // =======================================================
  // FETCH MR LIST
  // =======================================================

  fetchMrList(
    searchQuery: string = ''
  ): void {

    this.searchSubject.next(
      searchQuery
    );
  }


  // =======================================================
  // MR SEARCH INPUT
  // =======================================================

  onMrSearchInput(
    event: Event
  ): void {

    const value =
      (
        event.target as HTMLInputElement
      ).value;


    this.mrSearchQuery =
      value;


    this.fetchMrList(value);
  }


  // =======================================================
  // TOGGLE MR DROPDOWN
  // =======================================================

  toggleMrDropdown(): void {

    this.isMrDropdownOpen =
      !this.isMrDropdownOpen;


    if (
      this.isMrDropdownOpen &&
      this.mrList.length === 0
    ) {

      this.fetchMrList('');
    }
  }


  // =======================================================
  // SELECT MR
  // =======================================================

  selectMr(
    mr: MedicalRepresentative
  ): void {

    this.selectedMr =
      mr;


    this.createRequest.mrId =
      mr.medicalRepresentativeId;


    this.isMrDropdownOpen =
      false;


    this.mrSearchQuery =
      '';
  }


  // =======================================================
  // CLEAR MR
  // =======================================================

  clearSelectedMr(
    event: MouseEvent
  ): void {

    event.stopPropagation();


    this.selectedMr =
      null;


    this.createRequest.mrId =
      0;


    this.fetchMrList('');
  }


  // =======================================================
  // LOAD REPORTS
  // =======================================================

// =======================================================
// LOAD REPORTS
// =======================================================

loadReports(): void {

  this.clearMessages();

  this.loadingReports = true;

  // =====================================================
  // BASE PARAMETERS
  // =====================================================

  let params = new HttpParams()
    .set(
      'month',
      String(this.selectedMonth)
    )
    .set(
      'year',
      String(this.selectedYear)
    )
    .set(
      'status',
      this.selectedStatus
    );

  // =====================================================
  // ALWAYS SEND AGENCY ID
  //
  // localStorage:
  // aid = agency ID
  // =====================================================

  if (
    this.agencyId &&
    this.agencyId > 0
  ) {

    params = params.set(
      'agencyId',
      String(this.agencyId)
    );

  } else {

    this.loadingReports = false;

    this.reports = [];

    this.errorMessage =
      'Agency ID was not found in localStorage.';

    console.error(
      'Agency ID missing. localStorage key: aid'
    );

    return;
  }


  // =====================================================
  // ROLE: AREA MANAGER / CREATE ROLE
  //
  // 11714ca6-4cdb-46c5-bb12-d582ef179bc2
  //
  // Send:
  // assignedAreaManager = localStorage.mid
  //
  // Do NOT send mrId
  // =====================================================

  if (
    this.roleId === this.ROLE_CREATE
  ) {

    if (
      this.mrIdFromStorage &&
      this.mrIdFromStorage > 0
    ) {

      params = params.set(
        'assignedAreaManager',
        String(this.mrIdFromStorage)
      );

    } else {

      this.loadingReports = false;

      this.reports = [];

      this.errorMessage =
        'Area Manager ID was not found in localStorage.';

      console.error(
        'Area Manager ID missing. localStorage key: mid'
      );

      return;
    }
  }


  // =====================================================
  // ROLE: MR VIEW
  //
  // fd1c87b5-524a-49e5-b60c-5d7b82ddeb43
  //
  // Send:
  // mrId = localStorage.mid
  // =====================================================

  else if (
    this.roleId === this.ROLE_MR_VIEW
  ) {

    if (
      this.mrIdFromStorage &&
      this.mrIdFromStorage > 0
    ) {

      params = params.set(
        'mrId',
        String(this.mrIdFromStorage)
      );

    } else {

      this.loadingReports = false;

      this.reports = [];

      this.errorMessage =
        'MR ID was not found in localStorage.';

      console.error(
        'MR ID missing. localStorage key: mid'
      );

      return;
    }
  }


  // =====================================================
  // DEBUG
  // =====================================================

  console.log(
    'ADMIN REPORT REQUEST:',
    {
      roleId: this.roleId,

      agencyId:
        params.get('agencyId'),

      assignedAreaManager:
        params.get('assignedAreaManager'),

      mrId:
        params.get('mrId'),

      month:
        params.get('month'),

      year:
        params.get('year'),

      status:
        params.get('status')
    }
  );


  // =====================================================
  // API CALL
  // =====================================================

  const sub =
    this.http
      .get<any>(
        `${this.apiUrl}/admin`,
        {
          params
        }
      )
      .subscribe({

        next: response => {

          this.loadingReports = false;

          if (
            response &&
            Array.isArray(response.data)
          ) {

            this.reports =
              response.data;

          }

          else if (
            Array.isArray(response)
          ) {

            this.reports =
              response;

          }

          else {

            this.reports = [];
          }

        },

        error: error => {

          this.loadingReports = false;

          this.reports = [];

          this.errorMessage =
            this.getApiErrorMessage(
              error,
              'Unable to load visit expense reports.'
            );

          console.error(
            'ADMIN REPORT API ERROR:',
            error
          );
        }

      });


  this.subscriptions.push(sub);
}

  // =======================================================
  // FILTER CHANGE
  // =======================================================

  onFilterChange(): void {

    this.loadReports();
  }


  // =======================================================
  // TOGGLE CREATE FORM
  // =======================================================

  toggleCreateForm(): void {

    /**
     * Extra security:
     *
     * Do not open form if user
     * doesn't have create permission.
     */
    if (
      !this.canCreateReport()
    ) {

      this.errorMessage =
        'You do not have permission to create a report.';

      return;
    }


    this.showCreateForm =
      !this.showCreateForm;


    this.clearMessages();


    if (
      this.showCreateForm
    ) {

      this.createRequest.reportMonth =
        this.selectedMonth;

      this.createRequest.reportYear =
        this.selectedYear;


      this.setRateForSelectedPeriod();


      this.fetchMrList('');
    }
  }


  // =======================================================
  // REPORT TYPE CHANGE
  // =======================================================

  onReportTypeChange(): void {

    if (
      this.createRequest.reportType !==
      'EARLY_CLOSURE'
    ) {

      this.createRequest.closureDate =
        null;

      this.createRequest.closureReason =
        '';
    }
  }


  // =======================================================
  // CREATE MONTHLY REPORT
  // =======================================================

  createMonthlyReport(): void {

    // =====================================================
    // ROLE SECURITY
    // =====================================================

    if (
      !this.canCreateReport()
    ) {

      this.errorMessage =
        'You do not have permission to create a report.';

      return;
    }


    this.clearMessages();


    // =====================================================
    // MR VALIDATION
    // =====================================================

    if (
      !this.createRequest.mrId ||
      Number(
        this.createRequest.mrId
      ) <= 0
    ) {

      this.errorMessage =
        'Please select a Medical Representative.';

      return;
    }


    // =====================================================
    // MONTH VALIDATION
    // =====================================================

    if (
      !this.createRequest.reportMonth ||
      this.createRequest.reportMonth < 1 ||
      this.createRequest.reportMonth > 12
    ) {

      this.errorMessage =
        'Please select a valid report month.';

      return;
    }


    // =====================================================
    // YEAR VALIDATION
    // =====================================================

    if (
      !this.createRequest.reportYear ||
      this.createRequest.reportYear < 2000
    ) {

      this.errorMessage =
        'Please select a valid report year.';

      return;
    }


    // =====================================================
    // RATE VALIDATION
    // =====================================================

    if (
      !this.createRequest.ratePerKm ||
      Number(
        this.createRequest.ratePerKm
      ) <= 0
    ) {

      this.errorMessage =
        `No valid KM rate configured for ${
          this.getMonthName(
            this.createRequest.reportMonth
          )
        } ${
          this.createRequest.reportYear
        }.`;

      return;
    }


    // =====================================================
    // EARLY CLOSURE VALIDATION
    // =====================================================

    if (
      this.createRequest.reportType ===
      'EARLY_CLOSURE'
    ) {

      if (
        !this.createRequest.closureDate
      ) {

        this.errorMessage =
          'Closure date is required for early closure.';

        return;
      }


      if (
        !this.createRequest.closureReason ||
        !this.createRequest.closureReason.trim()
      ) {

        this.errorMessage =
          'Closure reason is required for early closure.';

        return;
      }
    }


    // =====================================================
    // PAYLOAD
    // =====================================================

    const payload = {

      mrId:
        Number(
          this.createRequest.mrId
        ),

      reportMonth:
        Number(
          this.createRequest.reportMonth
        ),

      reportYear:
        Number(
          this.createRequest.reportYear
        ),

      reportType:
        this.createRequest.reportType,

      closureDate:
        this.createRequest.closureDate
          ? new Date(
              this.createRequest.closureDate
            ).toISOString()
          : null,

      closureReason:
        this.createRequest.closureReason
          ?.trim() || '',

      ratePerKm:
        Number(
          this.createRequest.ratePerKm
        )
    };


    console.log(
      'CREATE REPORT PAYLOAD:',
      payload
    );


    this.creatingReport =
      true;


    const sub =
      this.http
        .post<any>(
          `${this.apiUrl}/monthly`,
          payload
        )
        .subscribe({

          next: response => {

            this.creatingReport =
              false;


            this.successMessage =
              response?.message ||
              'Monthly visit expense report created successfully.';


            this.showCreateForm =
              false;


            this.resetCreateForm();


            this.loadReports();
          },


          error: error => {

            this.creatingReport =
              false;


            this.errorMessage =
              this.getApiErrorMessage(
                error,
                'Unable to create monthly report.'
              );
          }

        });


    this.subscriptions.push(sub);
  }


  // =======================================================
  // RESET CREATE FORM
  // =======================================================

  resetCreateForm(): void {

    this.createRequest = {

      mrId:
        0,

      reportMonth:
        this.selectedMonth,

      reportYear:
        this.selectedYear,

      reportType:
        'NORMAL',

      closureDate:
        null,

      closureReason:
        '',

      ratePerKm:
        0
    };


    this.selectedMr =
      null;


    this.mrSearchQuery =
      '';


    this.isMrDropdownOpen =
      false;


    this.setRateForSelectedPeriod();
  }


  // =======================================================
  // CLEAR MESSAGES
  // =======================================================

  clearMessages(): void {

    this.successMessage =
      '';

    this.errorMessage =
      '';
  }


  // =======================================================
  // CLOSE SUCCESS
  // =======================================================

  closeSuccess(): void {

    this.successMessage =
      '';
  }


  // =======================================================
  // CLOSE ERROR
  // =======================================================

  closeError(): void {

    this.errorMessage =
      '';
  }


  // =======================================================
  // API ERROR
  // =======================================================

  private getApiErrorMessage(
    error: any,
    fallback: string
  ): string {

    if (
      error?.error?.message
    ) {

      return error.error.message;
    }


    if (
      error?.message
    ) {

      return error.message;
    }


    return fallback;
  }


  // =======================================================
  // PDF PREVIEW
  // =======================================================

  previewReport(
    report?:
      VisitExpenseReport | number
  ): void {

    let id:
      number | undefined;


    if (
      typeof report === 'number'
    ) {

      id =
        report;

    } else {

      id =
        report?.reportId ||
        this.selectedReport?.reportId;
    }


    if (!id) {
      return;
    }


    this.clearMessages();


    this.previewLoading =
      true;


    this.showPreviewModal =
      true;


    this.revokePreviewUrl();


    const sub =
      this.http
        .get(
          `${this.apiUrl}/${id}/preview`,
          {
            responseType: 'blob'
          }
        )
        .subscribe({

          next: blob => {

            this.previewLoading =
              false;


            this.currentObjectUrl =
              window.URL.createObjectURL(
                blob
              );


            this.previewUrl =
              this.sanitizer
                .bypassSecurityTrustResourceUrl(
                  this.currentObjectUrl
                );
          },


          error: error => {

            this.previewLoading =
              false;


            this.showPreviewModal =
              false;


            this.errorMessage =
              this.getApiErrorMessage(
                error,
                'Unable to load PDF preview.'
              );
          }

        });


    this.subscriptions.push(sub);
  }


  // =======================================================
  // CLOSE PREVIEW
  // =======================================================

  closePreview(): void {

    this.showPreviewModal =
      false;

    this.previewLoading =
      false;

    this.revokePreviewUrl();
  }


  // =======================================================
  // REVOKE PREVIEW URL
  // =======================================================

  private revokePreviewUrl(): void {

    if (
      this.currentObjectUrl
    ) {

      window.URL.revokeObjectURL(
        this.currentObjectUrl
      );


      this.currentObjectUrl =
        null;
    }


    this.previewUrl =
      null;
  }


  // =======================================================
  // CAN DECIDE
  // =======================================================

  canDecide(
    report:
      VisitExpenseReport | null
  ): boolean {

    /**
     * ROLE CHECK
     *
     * Only:
     *
     * a5fabfee...
     *
     * can approve/reject.
     */
    if (
      !this.canApproveReject()
    ) {

      return false;
    }


    if (!report) {
      return false;
    }


    const status =
      (
        report.reportStatus || ''
      ).toLowerCase();


    if (
      status !== 'pending'
    ) {

      return false;
    }


    if (
      report.canDecide === true
    ) {

      return true;
    }


    if (
      report.reportEndDate
    ) {

      const end =
        new Date(
          report.reportEndDate
        );


      const today =
        new Date();


      today.setHours(
        0,
        0,
        0,
        0
      );


      end.setHours(
        0,
        0,
        0,
        0
      );


      return today > end;
    }


    return false;
  }


  // =======================================================
  // CAN APPROVE
  // =======================================================

  canApprove(
    report:
      VisitExpenseReport
  ): boolean {

    return this.canDecide(
      report
    );
  }


  // =======================================================
  // CAN REJECT
  // =======================================================

  canReject(
    report:
      VisitExpenseReport
  ): boolean {

    return this.canDecide(
      report
    );
  }


  // =======================================================
  // OPEN APPROVE MODAL
  // =======================================================

  openApproveModal(
    report?:
      VisitExpenseReport
  ): void {

    if (
      !this.canApproveReject()
    ) {

      this.errorMessage =
        'You do not have permission to approve reports.';

      return;
    }


    if (report) {

      this.selectedReport =
        report;
    }


    if (
      !this.selectedReport
    ) {

      return;
    }


    if (
      !this.canDecide(
        this.selectedReport
      )
    ) {

      this.errorMessage =
        'This report is not eligible for approval yet.';

      return;
    }


    this.approveRemarks =
      '';


    this.showApproveModal =
      true;
  }


  // =======================================================
  // CLOSE APPROVE MODAL
  // =======================================================

  closeApproveModal(): void {

    if (this.approving) {
      return;
    }


    this.showApproveModal =
      false;


    this.approveRemarks =
      '';
  }


  // =======================================================
  // OPEN REJECT MODAL
  // =======================================================

  openRejectModal(
    report?:
      VisitExpenseReport
  ): void {

    if (
      !this.canApproveReject()
    ) {

      this.errorMessage =
        'You do not have permission to reject reports.';

      return;
    }


    if (report) {

      this.selectedReport =
        report;
    }


    if (
      !this.selectedReport
    ) {

      return;
    }


    if (
      !this.canDecide(
        this.selectedReport
      )
    ) {

      this.errorMessage =
        'This report is not eligible for rejection yet.';

      return;
    }


    this.rejectionReason =
      '';


    this.showRejectModal =
      true;
  }


  // =======================================================
  // CLOSE REJECT MODAL
  // =======================================================

  closeRejectModal(): void {

    if (this.rejecting) {
      return;
    }


    this.showRejectModal =
      false;


    this.rejectionReason =
      '';
  }


  // =======================================================
  // APPROVE REPORT
  // =======================================================

  approveReport(): void {

    if (
      !this.canApproveReject()
    ) {

      this.errorMessage =
        'You do not have permission to approve reports.';

      return;
    }


    if (
      !this.selectedReport
    ) {

      return;
    }


    if (
      !this.canDecide(
        this.selectedReport
      )
    ) {

      this.errorMessage =
        'This report is not eligible for approval yet.';

      return;
    }


    this.approving =
      true;


    const reportId =
      this.selectedReport.reportId;


    const payload = {

      remarks:
        this.approveRemarks
          ?.trim() || ''
    };


    const sub =
      this.http
        .post<any>(
          `${this.apiUrl}/${reportId}/approve`,
          payload
        )
        .subscribe({

          next: response => {

            this.approving =
              false;


            this.showApproveModal =
              false;


            this.approveRemarks =
              '';


            this.successMessage =
              response?.message ||
              'Report approved successfully.';


            this.loadReports();
          },


          error: error => {

            this.approving =
              false;


            this.errorMessage =
              this.getApiErrorMessage(
                error,
                'Unable to approve report.'
              );
          }

        });


    this.subscriptions.push(sub);
  }


  // =======================================================
  // REJECT REPORT
  // =======================================================

  rejectReport(): void {

    if (
      !this.canApproveReject()
    ) {

      this.errorMessage =
        'You do not have permission to reject reports.';

      return;
    }


    if (
      !this.selectedReport
    ) {

      return;
    }


    if (
      !this.canDecide(
        this.selectedReport
      )
    ) {

      this.errorMessage =
        'This report is not eligible for rejection yet.';

      return;
    }


    if (
      !this.rejectionReason ||
      !this.rejectionReason.trim()
    ) {

      this.errorMessage =
        'Rejection reason is required.';

      return;
    }


    this.rejecting =
      true;


    const reportId =
      this.selectedReport.reportId;


    const payload = {

      rejectionReason:
        this.rejectionReason.trim()
    };


    const sub =
      this.http
        .post<any>(
          `${this.apiUrl}/${reportId}/reject`,
          payload
        )
        .subscribe({

          next: response => {

            this.rejecting =
              false;


            this.showRejectModal =
              false;


            this.rejectionReason =
              '';


            this.successMessage =
              response?.message ||
              'Report rejected successfully.';


            this.loadReports();
          },


          error: error => {

            this.rejecting =
              false;


            this.errorMessage =
              this.getApiErrorMessage(
                error,
                'Unable to reject report.'
              );
          }

        });


    this.subscriptions.push(sub);
  }


  // =======================================================
  // MONTH NAME
  // =======================================================

  getMonthName(
    monthValue?: number
  ): string {

    const found =
      this.months.find(
        m =>
          m.value === monthValue
      );


    return found
      ? found.name
      : '-';
  }


  // =======================================================
  // FORMAT CURRENCY
  // =======================================================

  formatCurrency(
    val?: number
  ): string {

    if (
      val === null ||
      val === undefined
    ) {

      return '₹0.00';
    }


    return `₹${val.toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )}`;
  }


  // =======================================================
  // FORMAT NUMBER
  // =======================================================

  formatNumber(
    val?: number
  ): string {

    if (
      val === null ||
      val === undefined
    ) {

      return '0';
    }


    return val.toLocaleString(
      'en-IN'
    );
  }


  // =======================================================
  // STATUS CLASS
  // =======================================================

  getStatusClass(
    status?: string
  ): string {

    const s =
      (
        status || ''
      ).toLowerCase();


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


  // =======================================================
  // STATUS LABEL
  // =======================================================

  getStatusLabel(
    status?: string
  ): string {

    if (!status) {

      return 'Pending';
    }


    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  }

}

