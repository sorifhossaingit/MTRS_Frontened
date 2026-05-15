import { Component, OnInit } from '@angular/core';
import {
  ShieldCheck,
  UserPlus,
  Building2,
  BadgeCheck,
  AlertTriangle,
  Users,
  Eye,
  Pencil,
  Trash2
} from 'lucide-angular';
import { SuperAdminMasterService } from '../../services/super-admin-master.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';


@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css'
})
export class SuperAdminDashboardComponent implements OnInit {

  // Icons
  ShieldCheck = ShieldCheck;
  UserPlus = UserPlus;
  Building2 = Building2;
  BadgeCheck = BadgeCheck;
  AlertTriangle = AlertTriangle;
  Users = Users;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;

  constructor(
    private superAdminService: SuperAdminMasterService,
    private fb: FormBuilder
  ) { }

  editModal = false;

  selectedAgencyId = 0;

  editForm!: FormGroup;



  // =========================
  // DASHBOARD STATS
  // =========================

  totalCompanies = 0;
  activeCompanies = 0;
  totalUsers = 0;
  activeUsers = 0;

  // =========================
  // TABLE DATA
  // =========================

  companies: any[] = [];

  // =========================
  // PAGINATION
  // =========================

  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;

  // =========================
  // FILTERS
  // =========================

  searchText = '';
  filterStatus = '';

  // =========================
  // LOADER
  // =========================

  loading = false;

  ngOnInit(): void {

    this.getDashboardSummary();

    this.getAgencyList();

    this.editForm = this.fb.group({

      name: ['', Validators.required],

      email: ['', Validators.required],

      phone: ['', Validators.required],

      address: [''],

      gstNumber: [''],

      licenseNo: [''],

      state: [''],

      city: [''],

      isActive: [true],

      allUsersStatusUpdate: [false],

      adminName: [''],

      adminEmail: [''],

      adminMobile: ['']
    });
  }

  // =========================
  // DASHBOARD SUMMARY API
  // =========================

  getDashboardSummary() {

    this.superAdminService.getdashboradsummery()
      .subscribe({

        next: (res: any) => {

          if (res.success) {

            this.totalCompanies = res.data.totalAgency;

            this.activeCompanies = res.data.activeAgency;

            this.totalUsers = res.data.totalUsers;

            this.activeUsers = res.data.activeUsers;
          }
        },

        error: (err) => {
          console.log(err);
        }
      });
  }

  // =========================
  // AGENCY LIST API
  // =========================

  getAgencyList() {

    this.loading = true;

    const params: any = {

      pageNumber: this.currentPage,

      pageSize: this.pageSize
    };

    // Search filter
    if (this.searchText) {

      params.name = this.searchText;
    }

    // Status filter
    if (this.filterStatus !== '') {

      params.isActive = this.filterStatus;
    }

    this.superAdminService.getAgency(params)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          if (res.success) {

            this.companies = res.data.data;

            this.totalRecords = res.data.totalRecords;
          }
        },

        error: (err) => {

          this.loading = false;

          console.log(err);
        }
      });
  }

  // =========================
  // SEARCH FILTER
  // =========================

  applyFilter() {

    this.currentPage = 1;

    this.getAgencyList();
  }

  // =========================
  // PAGE CHANGE
  // =========================

  changePage(page: number) {

    this.currentPage = page;

    this.getAgencyList();
  }

  // =========================
  // STATUS FILTER
  // =========================

  onStatusChange(status: string) {

    this.filterStatus = status;

    this.currentPage = 1;

    this.getAgencyList();
  }

  // =========================
  // ACTIONS
  // =========================

  editCompany(company: any) {

    this.selectedAgencyId = company.agencyId;

    this.editForm.patchValue({

      name: company.companyName,

      email: company.email,

      phone: company.phone,

      address: company.address,

      gstNumber: company.gstNumber,

      licenseNo: company.licenseNo,

      state: company.state,

      city: company.city,

      isActive: company.isActive,

      allUsersStatusUpdate: false,

      adminName: company.adminName,

      adminEmail: company.adminEmail,

      adminMobile: company.adminMobile
    });

    this.editModal = true;
  }

  closeModal() {

    this.editModal = false;
  }

  updateAgency() {

    if (this.editForm.invalid) {

      this.editForm.markAllAsTouched();
      console.log("ferr")

      return;
    }

    const rid = Number(
      localStorage.getItem('rid')
    );

    const payload = {

      agencyId: this.selectedAgencyId,

      ...this.editForm.value,

      updatedBy: rid
    };

    console.log(payload);

    this.superAdminService
      .updateAgency(payload)
      .subscribe({

        next: (res: any) => {

          if (res.success) {

            alert('Agency updated successfully');

            this.closeModal();

            // Refresh Table
            this.getAgencyList();
          }
        },

        error: (err) => {

          console.log(err);
        }
      });
  }

  // =========================
  // TOTAL PAGES
  // =========================

  get totalPages(): number {

    return Math.ceil(
      this.totalRecords / this.pageSize
    );
  }

  // =========================
  // PAGE ARRAY
  // =========================

  get pages(): number[] {

    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }
}