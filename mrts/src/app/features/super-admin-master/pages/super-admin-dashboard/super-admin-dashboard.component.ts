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
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css'
})
export class SuperAdminDashboardComponent implements OnInit {

  // 🔷 Icons
  ShieldCheck = ShieldCheck;
  UserPlus = UserPlus;
  Building2 = Building2;
  BadgeCheck = BadgeCheck;
  AlertTriangle = AlertTriangle;
  Users = Users;
  Pencil = Pencil;

  constructor(
    private superAdminService: SuperAdminMasterService,
    private fb: FormBuilder
  ) { }

  // 🔷 Modal
  editModal = false;

  selectedAgencyId = 0;

  // 🔷 Form
  editForm!: FormGroup;

  // 🔷 Dashboard Summary
  totalCompanies = 0;
  activeCompanies = 0;
  totalUsers = 0;
  activeUsers = 0;

  // 🔷 Table Data
  companies: any[] = [];

  // 🔷 Pagination
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;

  // 🔷 Filters
  searchText = '';
  filterStatus: any = '';

  // 🔷 Loader
  loading = false;

  ngOnInit(): void {

    this.initializeForm();

    this.getDashboardSummary();

    this.getAgencyList();
  }

  // ============================================
  // INITIALIZE FORM
  // ============================================

  initializeForm() {

    this.editForm = this.fb.group({

      companyName: ['', Validators.required],

      agencyEmail: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      agencyPhone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      address: ['', Validators.required],

      gstNumber: ['', Validators.required],

      licenseNo: ['', Validators.required],

      state: ['', Validators.required],

      city: ['', Validators.required],

      isActive: [true],

      adminName: ['', Validators.required],

      adminEmail: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      adminMobile: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      imageUrl: ['']
    });
  }

  // ============================================
  // DASHBOARD SUMMARY
  // ============================================

  getDashboardSummary() {

    this.superAdminService 
      .getdashboradsummery()
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

  // ============================================
  // GET AGENCY LIST
  // ============================================

  getAgencyList() {

    this.loading = true;

    const params: any = {

      PageNumber: this.currentPage,

      PageSize: this.pageSize
    };

    if (this.searchText) {

      params.Search = this.searchText;
    }

    if (this.filterStatus !== '') {

      params.isActive = this.filterStatus;
    }

    this.superAdminService
      .getAgency(params)
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

  // ============================================
  // FILTER
  // ============================================

  applyFilter() {

    this.currentPage = 1;

    this.getAgencyList();
  }

  // ============================================
  // PAGE CHANGE
  // ============================================

  changePage(page: number) {

    if (page < 1 || page > this.totalPages) {

      return;
    }

    this.currentPage = page;

    this.getAgencyList();
  }

  // ============================================
  // EDIT COMPANY
  // ============================================

  editCompany(company: any) {

    this.selectedAgencyId = company.agencyId;

    this.editForm.patchValue({

      companyName: company.companyName,

      agencyEmail: company.email,

      agencyPhone: company.phone,

      address: company.address,

      gstNumber: company.gstNumber,

      licenseNo: company.licenseNo,

      state: company.state,

      city: company.city,

      isActive: company.isActive,

      adminName: company.adminName,

      adminEmail: company.adminEmail,

      adminMobile: company.adminMobile,

      imageUrl: company.imageUrl || ''
    });

    this.editModal = true;
  }

  // ============================================
  // CLOSE MODAL
  // ============================================

  closeModal() {

    this.editModal = false;
  }

  // ============================================
  // UPDATE AGENCY
  // ============================================

  updateAgency() {

    if (this.editForm.invalid) {

      this.editForm.markAllAsTouched();

      return;
    }

    console.log('Update button clicked');

    let updatedBy = 0;

    const token = localStorage.getItem('token');

    if (token) {

      const decodedToken: any = jwtDecode(token);

      updatedBy =
        Number(
          decodedToken?.nameid ||
          decodedToken?.sub ||
          decodedToken?.userId
        );
    }

    const payload = {

      agencyId: this.selectedAgencyId,

      companyName: this.editForm.value.companyName,

      agencyEmail: this.editForm.value.agencyEmail,

      agencyPhone: this.editForm.value.agencyPhone,

      address: this.editForm.value.address,

      gstNumber: this.editForm.value.gstNumber,

      licenseNo: this.editForm.value.licenseNo,

      state: this.editForm.value.state,

      city: this.editForm.value.city,

      isActive: this.editForm.value.isActive,

      adminName: this.editForm.value.adminName,

      adminEmail: this.editForm.value.adminEmail,

      adminMobile: this.editForm.value.adminMobile,

      imageUrl: this.editForm.value.imageUrl || '',

      updatedBy: updatedBy
    };

    this.superAdminService
      .updateAgency(payload)
      .subscribe({

        next: (res: any) => {

          if (res.success) {

            alert('Agency updated successfully');

            this.closeModal();

            this.getAgencyList();
          }
        },

        error: (err) => {

          console.log(err);

          alert('Failed to update agency');
        }
      });
  }

  // ============================================
  // TOTAL PAGES
  // ============================================

  get totalPages(): number {

    return Math.ceil(
      this.totalRecords / this.pageSize
    );
  }

  // ============================================
  // PAGE ARRAY
  // ============================================

  get pages(): number[] {

    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

}