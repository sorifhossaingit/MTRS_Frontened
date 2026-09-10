import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  DestroyRef,
  inject
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Subject } from 'rxjs';

import { debounceTime } from 'rxjs/operators';

import Swal from 'sweetalert2';

import {
  Users,
  UserCheck,
  UserX,
  Search,
  Pencil,
  Trash2,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-angular';

import { MrService } from '../../services/mr.service';
import { AreaManagerService } from '../../../area-manager/services/area-manager.service';
import { CustomerService } from '../../../customer-master/services/customer.service';
@Component({
  selector: 'app-mr-dashboard',
  templateUrl: './mr-dashboard.component.html',
  styleUrl: './mr-dashboard.component.css'
})
export class MrDashboardComponent implements OnInit {

  @ViewChild('routeDropdownContainer')
  routeDropdownContainer!: ElementRef;


  // =========================================================
  // LUCIDE ICONS
  // =========================================================

  Users = Users;
  UserCheck = UserCheck;
  UserX = UserX;
  Search = Search;
  Pencil = Pencil;
  Trash2 = Trash2;
  Plus = Plus;
  CheckCircle = CheckCircle;
  XCircle = XCircle;


  // =========================================================
  // DATA
  // =========================================================

  mrList: any[] = [];

  areas: any[] = [];

  routeList: any[] = [];

  filteredRoutes: any[] = [];


  // =========================================================
  // ROUTE MULTI SELECT
  // =========================================================

  selectedRouteIds: number[] = [];

  showRouteDropdown = false;

  routeSearch = '';

  private routeSearch$ =
    new Subject<string>();


  // =========================================================
  // FORMS
  // =========================================================

  filterForm!: FormGroup;

  updateForm!: FormGroup;


  // =========================================================
  // PAGINATION
  // =========================================================

  pageNumber = 1;

  pageSize = 10;

  totalRecords = 0;


  // =========================================================
  // MODAL
  // =========================================================

  showUpdateModal = false;

  isUpdating = false;


  // =========================================================
  // AREA / ROUTE LOADING
  // =========================================================

  isLoadingAreas = false;

  isLoadingRoutes = false;


  // =========================================================
  // LOCAL STORAGE
  // =========================================================

  agencyId =
    Number(localStorage.getItem('aid')) || 0;

  managerId =
    Number(localStorage.getItem('mid')) || 0;

  // =========================================================
  // ROLE
  // =========================================================

  readonly adminRoleId =
    'a5fabfee-5506-4e12-bfec-c898fc5af3ae';

  readonly areaManagerRoleId =
    '11714ca6-4cdb-46c5-bb12-d582ef179bc2';

  roleId =
    localStorage.getItem('rid') || '';

  isAdmin =
    this.roleId === this.adminRoleId;

  isAreaManager =
    this.roleId === this.areaManagerRoleId;

  // =========================================================
  // AREA MANAGERS
  // =========================================================

  areaManagers: any[] = [];

  selectedAreaManagerId: number | null = null;

  isLoadingAreaManagers = false;


  // =========================================================
  // DASHBOARD KPI
  // =========================================================

  totalMR = 0;

  activeMR = 0;

  presentCount = 0;

  absentCount = 0;


  private destroyRef =
    inject(DestroyRef);


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private fb: FormBuilder,
    private mrService: MrService,
    private areaManagerService: AreaManagerService,
    private customerService: CustomerService
    
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.initializeForms();

    this.setupDebounceFilter();

    this.loadAreas();

    this.getMrList();

    this.loadDashboard();
  }


  // =========================================================
  // CLICK OUTSIDE ROUTE DROPDOWN
  // =========================================================

  @HostListener(
    'document:click',
    ['$event']
  )
  clickout(event: Event): void {

    if (
      this.routeDropdownContainer &&
      !this.routeDropdownContainer.nativeElement.contains(
        event.target
      )
    ) {

      this.showRouteDropdown = false;
    }
  }


  // =========================================================
  // INITIALIZE FORMS
  // =========================================================

  initializeForms(): void {

    this.filterForm =
      this.fb.group({

        name: [''],

        email: [''],

        mobile: [''],

        isActive: [null]
      });


    this.updateForm =
      this.fb.group({

        medicalRepresentativeId: [0],

        name: [
          '',
          Validators.required
        ],

        contactPerson: [''],

        mobile: [''],

        email: [''],

        address: [''],

        city: [''],

        state: [''],

        pincode: [''],

        region: [''],

        // =====================================================
        // AREA
        // =====================================================

        area: [
          null,
          Validators.required
        ],

        // =====================================================
        // ROUTES
        // =====================================================

        routeIds: [[]],

        isActive: [true]
      });
  }


  // =========================================================
  // FILTER DEBOUNCE
  // =========================================================

  setupDebounceFilter(): void {

    this.routeSearch$
      .pipe(
        debounceTime(200),
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe(
        (search) => {

          if (!search) {

            this.filteredRoutes =
              [...this.routeList];

          } else {

            this.filteredRoutes =
              this.routeList.filter(
                r =>
                  r.routeName
                    ?.toLowerCase()
                    .includes(search)
              );
          }
        }
      );
  }


  // =========================================================
  // ROUTE SEARCH
  // =========================================================

  onRouteSearchChange(): void {

    this.routeSearch$.next(
      this.routeSearch
        .toLowerCase()
        .trim()
    );
  }


  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  loadDashboard(): void {

    const payload = {

      agencyId:
        this.agencyId,

      areaManagerId:
        this.managerId
    };


    this.mrService
      .get_attendance_dashboard_ar(payload)
      .subscribe({

        next: (res: any) => {

          if (res?.success) {

            this.totalMR =
              res.data
                ?.totalMedicalRepresentatives || 0;

            this.activeMR =
              res.data
                ?.activeMedicalRepresentatives || 0;

            this.presentCount =
              res.data
                ?.presentMedicalRepresentatives || 0;

            this.absentCount =
              res.data
                ?.absentMedicalRepresentatives || 0;
          }
        },

        error: (err) => {

          console.error(
            'Dashboard error:',
            err
          );
        }
      });
  }


  // =========================================================
  // LOAD AREAS
  // =========================================================

  loadAreas(): void {

    if (!this.agencyId || this.agencyId <= 0) {
      console.error('Invalid Agency ID:', this.agencyId);
      this.areas = [];
      return;
    }

    // ADMIN: select an Area Manager first.
    if (this.isAdmin) {
      this.areas = [];
      this.selectedAreaManagerId = null;
      this.loadAreaManagers();
      return;
    }

    // AREA MANAGER: use manager ID from localStorage.
    if (this.isAreaManager) {
      if (!this.managerId || this.managerId <= 0) {
        console.error(
          'Invalid Area Manager ID:',
          this.managerId
        );
        this.areas = [];
        return;
      }

      this.selectedAreaManagerId = this.managerId;
      this.loadAreasForManager(this.managerId);
      return;
    }

    console.error('Unknown Role ID:', this.roleId);
    this.areas = [];
  }

  // =========================================================
  // LOAD ACTIVE AREA MANAGERS - ADMIN ONLY
  // =========================================================

  loadAreaManagers(): void {

    if (!this.isAdmin) {
      return;
    }

    this.isLoadingAreaManagers = true;

    this.areaManagerService
      .getActiveAreaManagers(this.agencyId)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Area Manager Dropdown Response:',
            res
          );

          this.areaManagers =
            Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? res
                : [];

          this.isLoadingAreaManagers = false;
        },

        error: (err: any) => {

          console.error(
            'Area Manager Dropdown Error:',
            err
          );

          this.areaManagers = [];
          this.isLoadingAreaManagers = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load Area Managers.'
          });
        }
      });
  }

  // =========================================================
  // LOAD AREAS FOR AREA MANAGER
  // =========================================================

  loadAreasForManager(
    areaManagerId: number,
    selectedAreaId: number | null = null
  ): void {

    if (
      !this.agencyId ||
      this.agencyId <= 0 ||
      !areaManagerId ||
      areaManagerId <= 0
    ) {
      this.areas = [];
      return;
    }

    this.isLoadingAreas = true;

    this.areaManagerService
      .getAreaForAreaManager(
        this.agencyId,
        areaManagerId
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Areas For Area Manager:',
            res
          );

          this.areas =
            Array.isArray(res?.data)
              ? res.data
              : [];

          this.isLoadingAreas = false;

          // Edit mode: select the MR's existing area
          // only after the manager's areas are loaded.
          if (
            selectedAreaId &&
            selectedAreaId > 0 &&
            this.areas.some(
              area =>
                Number(area.areaId) ===
                Number(selectedAreaId)
            )
          ) {

            this.updateForm.patchValue(
              {
                area: Number(selectedAreaId)
              },
              {
                emitEvent: false
              }
            );

            this.getRouteListByArea(
              Number(selectedAreaId)
            );
          }
        },

        error: (err: any) => {

          console.error(
            'Areas For Manager Error:',
            err
          );

          this.areas = [];
          this.isLoadingAreas = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load areas for Area Manager.'
          });
        }
      });
  }

  // =========================================================
  // ADMIN AREA MANAGER CHANGE
  // =========================================================

  onAreaManagerChange(
    value: number | string | null
  ): void {

    const areaManagerId =
      value === null ||
      value === '' ||
      value === undefined
        ? null
        : Number(value);

    this.selectedAreaManagerId =
      areaManagerId && areaManagerId > 0
        ? areaManagerId
        : null;

    this.updateForm.patchValue(
      {
        area: null,
        routeIds: []
      },
      {
        emitEvent: false
      }
    );

    this.selectedRouteIds = [];
    this.routeList = [];
    this.filteredRoutes = [];
    this.routeSearch = '';
    this.showRouteDropdown = false;

    if (!this.selectedAreaManagerId) {
      this.areas = [];
      return;
    }

    this.loadAreasForManager(
      this.selectedAreaManagerId
    );
  }

  // =========================================================
  // SELECTED AREA
  // =========================================================

  get selectedArea(): any | null {

    const areaId =
      Number(
        this.updateForm
          ?.get('area')
          ?.value
      );

    if (!areaId || areaId <= 0) {
      return null;
    }

    return this.areas.find(
      area =>
        Number(area.areaId) === areaId
    ) || null;
  }

  // =========================================================
  // AREA CHANGE
  // =========================================================

  onAreaChange(): void {

    const areaId =
      Number(
        this.updateForm
          .get('area')
          ?.value
      );


    console.log(
      'Selected Area ID:',
      areaId
    );


    // Clear old routes
    this.selectedRouteIds = [];

    this.updateForm.patchValue(
      {
        routeIds: []
      },
      {
        emitEvent: false
      }
    );


    this.routeList = [];

    this.filteredRoutes = [];


    // No area
    if (
      !areaId ||
      areaId <= 0
    ) {

      return;
    }


    // Load routes for selected area
    this.getRouteListByArea(
      areaId
    );
  }


  // =========================================================
  // GET ROUTES BY AREA
  // =========================================================

  getRouteListByArea(
    areaId: number
  ): void {

    const agencyId =
      Number(this.agencyId);

    const selectedAreaId =
      Number(areaId);


    if (
      !agencyId ||
      agencyId <= 0
    ) {

      console.error(
        'Invalid Agency ID:',
        agencyId
      );

      return;
    }


    if (
      !selectedAreaId ||
      selectedAreaId <= 0
    ) {

      this.routeList = [];

      this.filteredRoutes = [];

      return;
    }


    this.isLoadingRoutes = true;


    console.log(
      'Loading routes for area:',
      {
        agencyId,
        areaId: selectedAreaId
      }
    );


    this.customerService
      .getRouteList(
        agencyId,
        selectedAreaId
      )
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Route API Response:',
            res
          );


          if (Array.isArray(res)) {

            this.routeList =
              res;

          } else {

            this.routeList =
              Array.isArray(res?.data)
                ? res.data
                : [];
          }


          this.filteredRoutes =
            [...this.routeList];


          console.log(
            'Routes for Area:',
            this.routeList
          );


          this.isLoadingRoutes = false;
        },

        error: (err: any) => {

          console.error(
            'Failed to load routes:',
            err
          );

          this.routeList = [];

          this.filteredRoutes = [];

          this.isLoadingRoutes = false;


          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load routes.'
          });
        }
      });
  }


  // =========================================================
  // GET MR LIST
  // =========================================================

getMrList(): void {

  const filterValue = this.filterForm?.value;

  // =========================================================
  // BASE PAYLOAD
  // =========================================================

  const payload: any = {

    agencyId:
      Number(this.agencyId),

    name:
      filterValue?.name?.trim() || null,

    email:
      filterValue?.email?.trim() || null,

    mobile:
      filterValue?.mobile?.trim() || null,

    isActive:
      filterValue?.isActive ?? null,

    pageNumber:
      this.pageNumber,

    pageSize:
      this.pageSize
  };


  // =========================================================
  // AREA MANAGER ROLE ONLY
  // =========================================================
  // Admin:
  // DO NOT SEND assignedAreaManager
  //
  // Area Manager:
  // SEND assignedAreaManager = mid
  // =========================================================

  const roleId =
    localStorage.getItem('rid') || '';

  const ADMIN_ROLE_ID =
    'a5fabfee-5506-4e12-bfec-c898fc5af3ae';

  const AREA_MANAGER_ROLE_ID =
    '11714ca6-4cdb-46c5-bb12-d582ef179bc2';


  if (
    roleId === AREA_MANAGER_ROLE_ID
  ) {

    const managerId =
      Number(
        localStorage.getItem('mid')
      ) || 0;

    if (managerId > 0) {

      payload.assignedAreaManager =
        managerId;

    }

  }

  // =========================================================
  // ADMIN
  // =========================================================
  // Do absolutely nothing here.
  // assignedAreaManager will NOT exist in payload.
  // =========================================================


  console.log(
    'RID:',
    roleId
  );

  console.log(
    'MR List Payload:',
    payload
  );


  // =========================================================
  // API
  // =========================================================

  this.mrService
    .get_mr(payload)
    .pipe(
      takeUntilDestroyed(
        this.destroyRef
      )
    )
    .subscribe({

      next: (res: any) => {

        console.log(
          'MR List Response:',
          res
        );

        if (res?.success) {

          this.mrList =
            res.data || [];

          this.totalRecords =
            res.totalRecords || 0;

        }

      },

      error: (err: any) => {

        console.error(
          'Get MR List Error:',
          err
        );

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            err?.error?.message ||
            'Failed to load MR list.'
        });

      }

    });
}


  // =========================================================
  // ROUTE DROPDOWN
  // =========================================================

  toggleRouteDropdown(
    event?: Event
  ): void {

    if (event) {

      event.stopPropagation();
    }


    // Do not open without area
    const areaId =
      Number(
        this.updateForm
          .get('area')
          ?.value
      );


    if (
      !areaId ||
      areaId <= 0
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Select Area',
        text: 'Please select an Area first.'
      });

      return;
    }


    this.showRouteDropdown =
      !this.showRouteDropdown;
  }


  // =========================================================
  // CHECK ROUTE SELECTED
  // =========================================================

  isSelected(
    routeId: number
  ): boolean {

    return this.selectedRouteIds
      .includes(routeId);
  }


  // =========================================================
  // TOGGLE ROUTE
  // =========================================================

  toggleRoute(
    item: any
  ): void {

    const routeId =
      Number(item.routeId);


    const index =
      this.selectedRouteIds
        .indexOf(routeId);


    if (index > -1) {

      this.selectedRouteIds
        .splice(index, 1);

    } else {

      this.selectedRouteIds
        .push(routeId);
    }


    this.updateForm.patchValue({

      routeIds:
        [...this.selectedRouteIds]
    });


    this.updateForm.markAsDirty();
  }


  // =========================================================
  // SELECTED ROUTE LABELS
  // =========================================================

  get selectedRouteLabels(): string {

    if (
      this.selectedRouteIds.length === 0
    ) {

      return 'Select Route(s)';
    }


    const selectedNames =
      this.routeList

        .filter(
          r =>
            this.selectedRouteIds
              .includes(
                Number(r.routeId)
              )
        )

        .map(
          r =>
            r.routeName
        );


    return selectedNames.join(', ');
  }


  // =========================================================
  // APPLY FILTER
  // =========================================================

  applyFilter(): void {

    this.pageNumber = 1;

    this.getMrList();
  }


  // =========================================================
  // RESET FILTER
  // =========================================================

  resetFilter(): void {

    this.filterForm.reset({

      name: '',

      email: '',

      mobile: '',

      isActive: null
    });


    this.pageNumber = 1;

    this.getMrList();
  }


  // =========================================================
  // CHANGE PAGE
  // =========================================================

  changePage(
    page: number
  ): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;
    }


    this.pageNumber = page;

    this.getMrList();
  }


  // =========================================================
  // TOTAL PAGES
  // =========================================================

  get totalPages(): number {

    return Math.ceil(
      this.totalRecords /
      this.pageSize
    ) || 1;
  }


  // =========================================================
  // EDIT MR
  // =========================================================

  editMr(
    mr: any
  ): void {

    console.log('Editing MR:', mr);

    const areaId =
      mr.area
        ? Number(mr.area)
        : null;

    const mrAreaManagerId =
      mr.assignedAreaManager
        ? Number(mr.assignedAreaManager)
        : null;

    this.selectedRouteIds = [];
    this.routeList = [];
    this.filteredRoutes = [];
    this.routeSearch = '';
    this.showRouteDropdown = false;

    this.updateForm.patchValue({

      medicalRepresentativeId:
        mr.medicalRepresentativeId,

      name:
        mr.name,

      contactPerson:
        mr.contactPerson,

      mobile:
        mr.mobile,

      email:
        mr.email,

      address:
        mr.address,

      city:
        mr.city,

      state:
        mr.state,

      pincode:
        mr.pincode,

      region:
        mr.region,

      area:
        null,

      routeIds:
        [],

      isActive:
        mr.isActive
    });

    // =======================================================
    // ADMIN
    // =======================================================

    if (this.isAdmin) {

      this.selectedAreaManagerId =
        mrAreaManagerId;

      if (mrAreaManagerId) {

        this.loadAreasForManager(
          mrAreaManagerId,
          areaId
        );
      }
    }

    // =======================================================
    // AREA MANAGER
    // =======================================================

    else if (this.isAreaManager) {

      this.selectedAreaManagerId =
        this.managerId;

      if (areaId) {

        this.updateForm.patchValue(
          {
            area: areaId
          },
          {
            emitEvent: false
          }
        );

        this.getRouteListByArea(areaId);
      }
    }

    // =======================================================
    // EXISTING ROUTES
    // =======================================================

    if (
      Array.isArray(mr.routeIds) &&
      mr.routeIds.length > 0
    ) {

      this.selectedRouteIds =
        mr.routeIds.map(
          (id: any) => Number(id)
        );

      this.updateForm.patchValue(
        {
          routeIds:
            [...this.selectedRouteIds]
        },
        {
          emitEvent: false
        }
      );

    } else if (
      mr.routeNames &&
      areaId
    ) {

      setTimeout(() => {

        const names =
          mr.routeNames
            .split(',')
            .map(
              (n: string) =>
                n.trim().toLowerCase()
            );

        this.selectedRouteIds =
          this.routeList
            .filter(
              r =>
                names.includes(
                  r.routeName
                    ?.trim()
                    .toLowerCase()
                )
            )
            .map(
              r =>
                Number(r.routeId)
            );

        this.updateForm.patchValue(
          {
            routeIds:
              [...this.selectedRouteIds]
          },
          {
            emitEvent: false
          }
        );

      }, 500);
    }

    this.showUpdateModal = true;
  }

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  closeModal(): void {

    this.showUpdateModal = false;

    this.showRouteDropdown = false;

    this.selectedRouteIds = [];

    this.routeList = [];

    this.filteredRoutes = [];

    this.routeSearch = '';

    this.updateForm.reset({

      medicalRepresentativeId: 0,

      name: '',

      contactPerson: '',

      mobile: '',

      email: '',

      address: '',

      city: '',

      state: '',

      pincode: '',

      region: '',

      area: null,

      routeIds: [],

      isActive: true
    });
  }


  // =========================================================
  // UPDATE MR
  // =========================================================

  updateMr(): void {

    if (
      this.updateForm.invalid ||
      this.isUpdating
    ) {

      this.updateForm.markAllAsTouched();

      return;
    }


    const formValue =
      this.updateForm.value;


    // =======================================================
    // AREA
    // =======================================================

    const areaId =
      Number(formValue.area);


    if (
      !areaId ||
      areaId <= 0
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'Please select an Area.'
      });

      return;
    }


    // =======================================================
    // ROUTES
    // =======================================================

    const routeIds =
      Array.isArray(
        formValue.routeIds
      )
        ? formValue.routeIds.map(
            (id: any) =>
              Number(id)
          )
        : [];


    // =======================================================
    // PAYLOAD
    // =======================================================

    const payload = {

      medicalRepresentativeId:
        Number(
          formValue.medicalRepresentativeId
        ),

      name:
        formValue.name,

      contactPerson:
        formValue.contactPerson,

      mobile:
        formValue.mobile,

      email:
        formValue.email,

      address:
        formValue.address,

      city:
        formValue.city,

      state:
        formValue.state,

      pincode:
        formValue.pincode,

      region:
        formValue.region,

      assignedAreaManager:
        this.selectedAreaManagerId ||
        this.managerId,

      // IMPORTANT
      area:
        areaId,

      // IMPORTANT
      routeIds:
        routeIds,

      isActive:
        formValue.isActive,

      updatedBy:
        this.managerId
    };


    console.log(
      'Update MR Payload:',
      payload
    );


    this.isUpdating = true;


    this.mrService
      .update_mr(payload)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe({

        next: (res: any) => {

          this.isUpdating = false;


          if (res?.success) {

            Swal.fire({
              icon: 'success',
              title: 'Success',
              text:
                res?.message ||
                'MR updated successfully.'
            });


            this.showUpdateModal =
              false;


            this.getMrList();

          } else {

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text:
                res?.message ||
                'Failed to update MR.'
            });
          }
        },

        error: (err: any) => {

          this.isUpdating = false;


          console.error(
            'Update MR Error:',
            err
          );


          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.message ||
              'Failed to update MR.'
          });
        }
      });
  }


  // =========================================================
  // DELETE / DEACTIVATE MR
  // =========================================================

  deleteMr(
    mr: any
  ): void {

    Swal.fire({

      title: 'Delete MR?',

      text:
        'This MR will be marked as inactive.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#dc2626',

      confirmButtonText:
        'Yes, Delete',

      cancelButtonText:
        'Cancel'

    }).then(
      (result) => {

        if (
          !result.isConfirmed
        ) {

          return;
        }


        // ===================================================
        // AREA
        // ===================================================

        const areaId =
          mr.area
            ? Number(mr.area)
            : null;


        // ===================================================
        // ROUTES
        // ===================================================

        let currentRouteIds:
          number[] = [];


        if (
          Array.isArray(
            mr.routeIds
          )
        ) {

          currentRouteIds =
            mr.routeIds.map(
              (id: any) =>
                Number(id)
            );

        } else if (
          mr.routeId
        ) {

          currentRouteIds = [
            Number(mr.routeId)
          ];
        }


        // ===================================================
        // PAYLOAD
        // ===================================================

        const payload = {

          medicalRepresentativeId:
            Number(
              mr.medicalRepresentativeId
            ),

          name:
            mr.name,

          contactPerson:
            mr.contactPerson,

          mobile:
            mr.mobile,

          email:
            mr.email,

          address:
            mr.address,

          city:
            mr.city,

          state:
            mr.state,

          pincode:
            mr.pincode,

          region:
            mr.region,

          assignedAreaManager:
            this.managerId,

          // IMPORTANT
          area:
            areaId,

          routeIds:
            currentRouteIds,

          isActive:
            false,

          updatedBy:
            this.managerId
        };


        console.log(
          'Delete MR Payload:',
          payload
        );


        this.mrService
          .update_mr(payload)
          .pipe(
            takeUntilDestroyed(
              this.destroyRef
            )
          )
          .subscribe({

            next: (res: any) => {

              if (
                res?.success
              ) {

                Swal.fire({
                  icon: 'success',
                  title: 'Deleted',
                  text:
                    'MR marked as inactive successfully.'
                });


                this.getMrList();

              } else {

                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text:
                    res?.message ||
                    'Failed to delete MR.'
                });
              }
            },

            error: (err: any) => {

              console.error(
                'Delete MR Error:',
                err
              );


              Swal.fire({
                icon: 'error',
                title: 'Error',
                text:
                  err?.error?.message ||
                  'Failed to delete MR.'
              });
            }
          });
      }
    );
  }


  // =========================================================
  // COUNTS
  // =========================================================

  get activeCount(): number {

    return this.mrList.filter(
      x =>
        x.isActive
    ).length;
  }


  get inactiveCount(): number {

    return this.mrList.filter(
      x =>
        !x.isActive
    ).length;
  }
}