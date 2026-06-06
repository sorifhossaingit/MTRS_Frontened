import { Component, OnInit } from '@angular/core';
import {
  Briefcase,
  UserPlus,
  Users,
  Activity,
  UserCheck,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { AreaManagerService } from '../../services/area-manager.service';

@Component({
  selector: 'app-area-manager-dashboard',
  templateUrl: './area-manager-dashboard.component.html',
  styleUrl: './area-manager-dashboard.component.css'
})
export class AreaManagerDashboardComponent implements OnInit {

  // =====================================================
  // ICONS
  // =====================================================

  Briefcase = Briefcase;
  UserPlus = UserPlus;
  Users = Users;
  Activity = Activity;
  UserCheck = UserCheck;
  Calendar = Calendar;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;
  X = X;

  // =====================================================
  // VARIABLES
  // =====================================================

  agencyId: number =
    Number(localStorage.getItem('aid')) || 0;

  userId: number = 0;

  areaManagers: any[] = [];

  loading = false;

  // Filters

  searchText = '';
  mobile = '';
  selectedRegion = '';
  isActive = '';

  // Pagination

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;
  pages: number[] = [];



  // Dashboard Cards

  totalManagers = 0;
  activeManagers = 0;
  inactiveManagers = 0;
  totalMRs = 0;
  todayVisits = 0;

  // Modal

  showEditModal = false;
  selectedManagerId: number = 0;

  editForm!: FormGroup;
  submitted = false;

  constructor(
    private areaManagerService: AreaManagerService,
    private fb: FormBuilder
  ) { }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.decodeToken();

    this.initializeForm();

    this.getManagers();

  }

  // =====================================================
  // FORM
  // =====================================================

  initializeForm() {

    this.editForm = this.fb.group({

      name: ['', Validators.required],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      gender: ['', Validators.required],

      dateOfBirth: ['', Validators.required],

      joiningDate: ['', Validators.required],

      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      region: ['', Validators.required],

      assignedArea: ['', Validators.required],

      address: ['', Validators.required],

      city: ['', Validators.required],

      state: ['', Validators.required],

      isActive: [true]

    });

  }

  get f() {
    return this.editForm.controls;
  }

  // =====================================================
  // TOKEN DECODE
  // =====================================================

  decodeToken() {

    const token = localStorage.getItem('token');

    if (token) {

      const decoded: any = jwtDecode(token);

      this.userId =
        decoded?.userId ||
        decoded?.UserId ||
        decoded?.id ||
        0;
    }

  }

  // =====================================================
  // GET AREA MANAGERS
  // =====================================================

  getManagers() {

    const params = {

      AgencyId: this.agencyId,

      Name: this.searchText || '',

      Mobile: this.mobile || '',

      Region: this.selectedRegion || '',

      IsActive:
        this.isActive === ''
          ? ''
          : this.isActive === 'true',

      PageNumber: this.currentPage,

      PageSize: this.pageSize

    };

    this.loading = true;

    this.areaManagerService
      .get_area_manager_details(params)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          this.areaManagers =
            res?.data || [];

          this.totalRecords =
            res?.totalCount ||
            res?.totalRecords ||
            0;

          this.totalPages =
            res?.totalPages || 0;

          this.pages = Array.from(
            { length: this.totalPages || 0 },
            (_, i) => i + 1
          );

          this.totalManagers =
            this.totalRecords;

          this.activeManagers =
            this.areaManagers.filter(
              (x: any) =>
                x.isActive === true
            ).length;

          this.inactiveManagers =
            this.areaManagers.filter(
              (x: any) =>
                x.isActive === false
            ).length;

          this.totalMRs =
            this.areaManagers.reduce(
              (sum: number, x: any) =>
                sum + (x.totalMRs || 0),
              0
            );

        },

        error: (err: any) => {

          this.loading = false;

          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load Area Managers'
          });

        }

      });

  }

  // =====================================================
  // FILTERS
  // =====================================================

  applyFilter() {

    this.currentPage = 1;

    this.getManagers();

  }

  resetFilters() {

    this.searchText = '';

    this.mobile = '';

    this.selectedRegion = '';

    this.isActive = '';

    this.currentPage = 1;

    this.getManagers();

  }

  // =====================================================
  // EDIT MANAGER
  // =====================================================

  editManager(manager: any) {

    this.selectedManagerId =
      manager.areaManagerId;

    this.showEditModal = true;

    this.editForm.patchValue({

      name: manager.name,

      email: manager.email,

      gender: manager.gender,

      dateOfBirth:
        manager.dateOfBirth
          ? manager.dateOfBirth.split('T')[0]
          : '',

      joiningDate:
        manager.joiningDate
          ? manager.joiningDate.split('T')[0]
          : '',

      mobile: manager.mobile,

      region: manager.region,

      assignedArea:
        manager.assignedArea,

      address: manager.address,

      city: manager.city,

      state: manager.state,

      isActive: manager.isActive

    });

  }

  closeModal() {

    this.showEditModal = false;

    this.submitted = false;

    this.selectedManagerId = 0;

    this.editForm.reset();

  }

  updateManager() {

    this.submitted = true;

    if (this.editForm.invalid) {

      this.editForm.markAllAsTouched();

      return;

    }

    const payload = {

      areaManagerId:
        this.selectedManagerId,

      agencyId:
        this.agencyId,

      updatedBy:
        this.userId,

      name:
        this.editForm.value.name,

      email:
        this.editForm.value.email,

      gender:
        this.editForm.value.gender,

      dateOfBirth:
        this.editForm.value.dateOfBirth
          ? this.editForm.value.dateOfBirth + 'T00:00:00'
          : '',

      joiningDate:
        this.editForm.value.joiningDate
          ? this.editForm.value.joiningDate + 'T00:00:00'
          : '',

      mobile:
        this.editForm.value.mobile,

      region:
        this.editForm.value.region,

      assignedArea:
        this.editForm.value.assignedArea,

      address:
        this.editForm.value.address,

      city:
        this.editForm.value.city,

      state:
        this.editForm.value.state,

      isActive:
        this.editForm.value.isActive

    };

    this.areaManagerService
      .update_area_manager_details(payload)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text:
              'Area Manager Updated Successfully'
          });

          this.closeModal();

          this.getManagers();

        },

        error: (err: any) => {

          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              'Failed To Update Manager'
          });

        }

      });

  }

  // =====================================================
  // SOFT DELETE
  // =====================================================

  deleteManager(manager: any) {

    Swal.fire({

      title: 'Deactivate Manager?',

      text: manager.name,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText:
        'Yes, Deactivate',

      cancelButtonText:
        'Cancel'

    }).then((result) => {

      if (!result.isConfirmed) return;

      const payload = {

        areaManagerId:
          manager.areaManagerId,

        agencyId:
          this.agencyId,

        name:
          manager.name,

        email:
          manager.email,

        gender:
          manager.gender,

        dateOfBirth:
          manager.dateOfBirth,

        joiningDate:
          manager.joiningDate,

        mobile:
          manager.mobile,

        region:
          manager.region,

        assignedArea:
          manager.assignedArea,

        address:
          manager.address,

        city:
          manager.city,

        state:
          manager.state,

        isActive: false,

        updatedBy:
          this.userId

      };

      this.areaManagerService
        .update_area_manager_details(payload)
        .subscribe({

          next: () => {

            Swal.fire({

              icon: 'success',

              title: 'Success',

              text:
                'Area Manager Deactivated Successfully'

            });

            this.getManagers();

          },

          error: (err: any) => {

            console.error(err);

            Swal.fire({

              icon: 'error',

              title: 'Error',

              text:
                'Failed To Deactivate Manager'

            });

          }

        });

    });

  }

  

  // =====================================================
  // PAGINATION
  // =====================================================

  goToPage(page: number) {

    this.currentPage = page;

    this.getManagers();

  }

  prevPage() {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.getManagers();

    }

  }

  nextPage() {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.getManagers();

    }

  }

}
