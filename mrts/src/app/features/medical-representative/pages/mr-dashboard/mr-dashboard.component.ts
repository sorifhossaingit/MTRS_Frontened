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

  /**
   * Currently selected area in the edit form.
   * This is used by the template to display the selected
   * area name/code without maintaining duplicate state.
   */
  get selectedArea(): any | null {
    const areaId = Number(
      this.updateForm?.get('area')?.value
    );

    if (!areaId || areaId <= 0) {
      return null;
    }

    return this.areas.find(
      area => Number(area.areaId) === areaId
    ) || null;
  }

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

    if (
      !this.agencyId ||
      this.agencyId <= 0
    ) {

      console.error(
        'Invalid Agency ID:',
        this.agencyId
      );

      return;
    }


    this.isLoadingAreas = true;


    this.areaManagerService
      .get_all_area({
        agencyId:
          this.agencyId,

        isActive:
          true
      })
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Area API Response:',
            res
          );


          this.areas =
            Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? res
                : [];


          console.log(
            'Areas:',
            this.areas
          );


          this.isLoadingAreas = false;
        },

        error: (err: any) => {

          console.error(
            'Failed to load areas:',
            err
          );

          this.areas = [];

          this.isLoadingAreas = false;


          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load areas.'
          });
        }
      });
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

    const payload = {

      agencyId:
        this.agencyId,

      assignedAreaManager:
        this.managerId,

      name:
        this.filterForm
          ?.value?.name || null,

      email:
        this.filterForm
          ?.value?.email || null,

      mobile:
        this.filterForm
          ?.value?.mobile || null,

      isActive:
        this.filterForm
          ?.value?.isActive ?? null,

      pageNumber:
        this.pageNumber,

      pageSize:
        this.pageSize
    };


    this.mrService
      .get_mr(payload)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe({

        next: (res: any) => {

          if (res?.success) {

            this.mrList =
              res.data || [];

            this.totalRecords =
              res.totalRecords || 0;
          }
        },

        error: (err: any) => {

          console.error(
            err
          );


          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load MR list.'
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

    console.log(
      'Editing MR:',
      mr
    );


    // =======================================================
    // SET AREA FIRST
    // =======================================================

    const areaId =
      mr.area
        ? Number(mr.area)
        : null;


    // =======================================================
    // RESET ROUTES
    // =======================================================

    this.selectedRouteIds = [];

    this.routeList = [];

    this.filteredRoutes = [];

    this.routeSearch = '';

    this.showRouteDropdown = false;


    // =======================================================
    // PATCH BASIC VALUES
    // =======================================================

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

      // IMPORTANT
      area:
        areaId,

      routeIds:
        [],

      isActive:
        mr.isActive
    });


    // =======================================================
    // LOAD ROUTES FOR EXISTING AREA
    // =======================================================

    if (
      areaId &&
      areaId > 0
    ) {

      this.getRouteListByArea(
        areaId
      );
    }


    // =======================================================
    // GET ROUTE IDS
    // =======================================================

    if (
      Array.isArray(mr.routeIds) &&
      mr.routeIds.length > 0
    ) {

      this.selectedRouteIds =
        mr.routeIds.map(
          (id: any) =>
            Number(id)
        );

    } else if (
      mr.routeNames &&
      areaId
    ) {

      /*
       * The GET API currently returns routeNames,
       * not routeIds.
       *
       * We therefore resolve route IDs after
       * loading routes for the selected Area.
       */

      setTimeout(() => {

        const names =
          mr.routeNames
            .split(',')
            .map(
              (n: string) =>
                n.trim()
                  .toLowerCase()
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


        this.updateForm.patchValue({

          routeIds:
            [...this.selectedRouteIds]

        });

      }, 300);

    } else {

      this.selectedRouteIds = [];
    }


    // =======================================================
    // OPEN MODAL
    // =======================================================

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