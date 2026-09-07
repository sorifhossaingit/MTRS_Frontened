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
  X,
  KeyRound
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
  KeyRound = KeyRound;

  // =====================================================
  // VARIABLES
  // =====================================================

  agencyId: number =
    Number(localStorage.getItem('aid')) || 0;

  userId: number = 0;

  areaManagers: any[] = [];

  // ALL ACTIVE AREAS
  areas: any[] = [];

  isLoadingAreas = false;

  loading = false;

  // Filters

  searchText = '';
  mobile = '';
  selectedRegion = '';

  // IMPORTANT:
  // Because HTML uses [ngValue]="true/false",
  // this must be boolean | ''
  isActive: boolean | '' = '';

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
  newManagerthismonth = 0;
  totalMRs = 0;
  todayVisits = 0;

  // Modal

  showEditModal = false;

  selectedManagerId: number = 0;

  editForm!: FormGroup;

  submitted = false;

  isUpdating = false;

  today: string = '';

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

    this.loadManagerDashboardSummary();

    // LOAD ACTIVE AREAS
    this.loadAreas();

    const now = new Date();

    this.today =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
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

      // NEW
      areaIds: [[]],

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
  // DASHBOARD SUMMARY
  // =====================================================

  loadManagerDashboardSummary() {

    this.areaManagerService
      .get_area_manager_dashborad_summery(this.agencyId)
      .subscribe({

        next: (res: any) => {

          this.totalManagers =
            res?.data?.totalAreaManagers || 0;

          this.activeManagers =
            res?.data?.activeAreaManagers || 0;

          this.inactiveManagers =
            res?.data?.inactiveAreaManagers || 0;

          this.newManagerthismonth =
            res?.data?.newAreaManagersThisMonth || 0;

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =====================================================
  // GET ALL ACTIVE AREAS
  // =====================================================

  loadAreas(): void {

    const agencyId =
      Number(localStorage.getItem('aid')) || 0;

    if (agencyId <= 0) {

      console.error('Invalid Agency ID');

      return;
    }

    this.isLoadingAreas = true;

    this.areaManagerService
      .get_all_area({
        agencyId: agencyId,
        isActive: true
      })
      .subscribe({

        // -------------------------------------------
        // SUCCESS
        // -------------------------------------------

        next: (res: any) => {

          console.log(
            'Area API Response:',
            res
          );

          this.areas =
            Array.isArray(res?.data)
              ? res.data
              : [];

          this.isLoadingAreas = false;

        },

        // -------------------------------------------
        // ERROR
        // -------------------------------------------

        error: (err: any) => {

          console.error(
            'Area API Error:',
            err
          );

          this.areas = [];

          this.isLoadingAreas = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load areas'
          });

        }

      });
  }

  // =====================================================
  // GET AREA MANAGERS
  // =====================================================

  getManagers() {

    const params: any = {

      AgencyId: this.agencyId,

      Name: this.searchText || '',

      Mobile: this.mobile || '',

      Region: this.selectedRegion || '',

      // IMPORTANT
      // Send '' OR boolean
      IsActive:
        this.isActive === ''
          ? ''
          : this.isActive,

      PageNumber: this.currentPage,

      PageSize: this.pageSize

    };

    this.loading = true;

    this.areaManagerService
      .get_area_manager_list(params)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          console.log(
            'Area Manager List Response:',
            res
          );

          // -----------------------------------------
          // LIST
          // -----------------------------------------

          this.areaManagers =
            Array.isArray(res?.data)
              ? res.data
              : [];

          // -----------------------------------------
          // PAGINATION
          // API RESPONSE:
          // totalCount
          // pageNumber
          // pageSize
          // -----------------------------------------

          this.totalRecords =
            Number(res?.totalCount) || 0;

          this.currentPage =
            Number(res?.pageNumber) ||
            this.currentPage;

          this.pageSize =
            Number(res?.pageSize) ||
            this.pageSize;

          this.totalPages =
            this.totalRecords > 0
              ? Math.ceil(
                  this.totalRecords /
                  this.pageSize
                )
              : 0;

          this.pages =
            Array.from(
              {
                length: this.totalPages
              },
              (_, i) => i + 1
            );

          // -----------------------------------------
          // DO NOT CHANGE YOUR EXISTING DASHBOARD
          // CALCULATIONS
          // -----------------------------------------

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

          console.error(
            'Area Manager List API Error:',
            err
          );

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
      Number(manager.areaManagerId) || 0;

    this.showEditModal = true;

    // -----------------------------------------
    // GET AREA IDS FROM API RESPONSE
    // -----------------------------------------

    const areaIds: number[] =
      Array.isArray(manager?.areas)
        ? manager.areas
            .map((area: any) =>
              Number(area.areaId)
            )
            .filter((id: number) =>
              id > 0
            )
        : [];

    console.log(
      'Selected Manager:',
      manager
    );

    console.log(
      'Selected Area IDs:',
      areaIds
    );

    // -----------------------------------------
    // PATCH FORM
    // -----------------------------------------

    this.editForm.patchValue({

      name:
        manager.name || '',

      email:
        manager.email || '',

      gender:
        manager.gender || '',

      dateOfBirth:
        manager.dateOfBirth
          ? manager.dateOfBirth.split('T')[0]
          : '',

      joiningDate:
        manager.joiningDate
          ? manager.joiningDate.split('T')[0]
          : '',

      mobile:
        manager.mobile || '',

      region:
        manager.region || '',

      assignedArea:
        manager.assignedArea || '',

      // NEW
      areaIds:
        areaIds,

      address:
        manager.address || '',

      city:
        manager.city || '',

      state:
        manager.state || '',

      isActive:
        manager.isActive === true

    });

  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeModal() {

    this.showEditModal = false;

    this.submitted = false;

    this.selectedManagerId = 0;

    this.editForm.reset({
      name: '',
      email: '',
      gender: '',
      dateOfBirth: '',
      joiningDate: '',
      mobile: '',
      region: '',
      assignedArea: '',
      areaIds: [],
      address: '',
      city: '',
      state: '',
      isActive: true
    });

  }

  // =====================================================
  // UPDATE AREA MANAGER
  // =====================================================

  updateManager(): void {

    this.submitted = true;

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (this.editForm.invalid) {

      this.editForm.markAllAsTouched();

      return;
    }

    // -----------------------------------------
    // START LOADING
    // -----------------------------------------

    this.isUpdating = true;

    const formValue =
      this.editForm.value;

    // -----------------------------------------
    // AREA IDS
    // -----------------------------------------

    const areaIds: number[] =
      Array.isArray(formValue.areaIds)
        ? formValue.areaIds
            .map((id: any) =>
              Number(id)
            )
            .filter((id: number) =>
              id > 0
            )
        : [];

    // -----------------------------------------
    // UPDATE PAYLOAD
    // -----------------------------------------

    const payload = {

      areaManagerId:
        this.selectedManagerId,

      agencyId:
        this.agencyId,

      name:
        formValue.name,

      email:
        formValue.email,

      mobile:
        formValue.mobile,

      gender:
        formValue.gender,

      dateOfBirth:
        formValue.dateOfBirth
          ? formValue.dateOfBirth + 'T00:00:00'
          : '',

      joiningDate:
        formValue.joiningDate
          ? formValue.joiningDate + 'T00:00:00'
          : '',

      region:
        formValue.region,

      assignedArea:
        formValue.assignedArea,

      // -----------------------------------------
      // IMPORTANT NEW FIELD
      // -----------------------------------------

      areaIds:
        areaIds,

      address:
        formValue.address,

      city:
        formValue.city,

      state:
        formValue.state,

      isActive:
        formValue.isActive === true,

      updatedBy:
        this.userId

    };

    console.log(
      'Update Area Manager Payload:',
      payload
    );

    // -----------------------------------------
    // API CALL
    // -----------------------------------------

    this.areaManagerService
      .update_area_manager_details(payload)
      .subscribe({

        // ==============================
        // SUCCESS
        // ==============================

        next: (res: any) => {

          this.isUpdating = false;

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text:
              res?.message ||
              'Area Manager Updated Successfully',
            confirmButtonColor: '#16a34a'
          }).then(() => {

            this.closeModal();

            // Reload manager list
            this.getManagers();

            // Reload dashboard summary
            this.loadManagerDashboardSummary();

          });

        },

        // ==============================
        // ERROR
        // ==============================

        error: (err: any) => {

          this.isUpdating = false;

          console.error(
            'Update Area Manager Error:',
            err
          );

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.message ||
              'Failed To Update Manager',
            confirmButtonColor: '#dc2626'
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

      // -----------------------------------------
      // GET EXISTING AREA IDS
      // -----------------------------------------

      const areaIds: number[] =
        Array.isArray(manager?.areas)
          ? manager.areas
              .map((area: any) =>
                Number(area.areaId)
              )
              .filter((id: number) =>
                id > 0
              )
          : [];

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

        // NEW
        areaIds:
          areaIds,

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

            this.loadManagerDashboardSummary();

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
  // RESET PASSWORD
  // =====================================================

  reset_password(data: any): void {

    Swal.fire({

      title: 'Reset Password?',

      text:
        `Are you sure you want to reset the password for ${data.name}?`,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, Reset',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#2563eb'

    }).then((result) => {

      if (result.isConfirmed) {

        const payload = {

          userId:
            data.userId,

          updatedBy:
            this.userId

        };

        this.areaManagerService
          .reset_password(payload)
          .subscribe({

            next: (res: any) => {

              Swal.fire({

                icon: 'success',

                title: 'Success',

                text:
                  res?.message ||
                  'Password reset successfully.'

              });

            },

            error: (err: any) => {

              Swal.fire({

                icon: 'error',

                title: 'Failed',

                text:
                  err?.error?.message ||
                  'Unable to reset password. Please try again.'

              });

            }

          });

      }

    });

  }

  // =====================================================
  // PAGINATION
  // =====================================================

  goToPage(page: number) {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

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

    if (
      this.currentPage < this.totalPages
    ) {

      this.currentPage++;

      this.getManagers();

    }

  }

}