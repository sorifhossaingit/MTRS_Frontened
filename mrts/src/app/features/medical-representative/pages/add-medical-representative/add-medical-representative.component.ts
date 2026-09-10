import {
  Component,
  OnInit,
  HostListener,
  ElementRef
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import {
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  UserCheck,
  Map,
  Route,
  Users,
  Building2,
  BarChart3,
  Target,
  TrendingUp,
  Hash,
  Percent,
  CheckCircle,
  Save
} from 'lucide-angular';

import { MrService } from '../../services/mr.service';

import {
  CustomerService
} from '../../../customer-master/services/customer.service';

import { AreaManagerService } from '../../../area-manager/services/area-manager.service';
// =========================================================
// ROUTE INTERFACE
// =========================================================

interface RouteItem {
  routeId: number;
  routeName: string;
  description?: string;
}


// =========================================================
// AREA INTERFACE
// =========================================================

interface AreaItem {
  areaId: number;
  areaName: string;
  areaCode?: string;
}


// =========================================================
// COMPONENT
// =========================================================

@Component({
  selector: 'app-add-medical-representative',

  templateUrl:
    './add-medical-representative.component.html',

  styleUrl:
    './add-medical-representative.component.css'
})
export class AddMedicalRepresentativeComponent
  implements OnInit {


  // =======================================================
  // LUCIDE ICONS
  // =======================================================

  readonly UserPlus = UserPlus;
  readonly ArrowLeft = ArrowLeft;
  readonly User = User;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly Briefcase = Briefcase;
  readonly Calendar = Calendar;
  readonly UserCheck = UserCheck;
  readonly Map = Map;
  readonly Route = Route;
  readonly Users = Users;
  readonly Building2 = Building2;
  readonly BarChart3 = BarChart3;
  readonly Target = Target;
  readonly TrendingUp = TrendingUp;
  readonly Hash = Hash;
  readonly Percent = Percent;
  readonly CheckCircle = CheckCircle;
  readonly Save = Save;


  // =======================================================
  // FORM
  // =======================================================

  mrForm!: FormGroup;

  submitted = false;

  isSaving = false;


  // =======================================================
  // AREA
  // =======================================================

  areas: AreaItem[] = [];

  selectedArea: AreaItem | null = null;

  isLoadingAreas = false;


  // =======================================================
  // ROUTES
  // =======================================================

  routeList: RouteItem[] = [];

  filteredRoutes: RouteItem[] = [];

  selectedRoutes: RouteItem[] = [];

  isLoadingRoutes = false;


  // =======================================================
  // ROUTE DROPDOWN
  // =======================================================

  showRouteDropdown = false;

  routeSearch = '';


  // =======================================================
  // LOCAL STORAGE VALUES
  // =======================================================

  readonly agencyId =
    Number(localStorage.getItem('aid')) || 0;

  readonly managerId =
    Number(localStorage.getItem('mid')) || 0;

  readonly createdBy =
    Number(localStorage.getItem('uid')) || 0;


  // =======================================================
  // ADD ROUTE MODAL
  // =======================================================

  showRouteModal = false;

  newRouteName = '';

  newRouteDescription = '';

  isAddingRoute: boolean = false;
  // =======================================================
  // CONSTRUCTOR
  // =======================================================

  constructor(
    private fb: FormBuilder,

    private mrService: MrService,

    private customerService: CustomerService,

    private areaManagerService: AreaManagerService,

    private router: Router,

    private eRef: ElementRef
  ) {}


  // =======================================================
  // INIT
  // =======================================================

  ngOnInit(): void {

    this.initializeForm();

    // Load Areas
    this.loadAreas();

    // Area -> Route listener
    this.setupAreaRouteListener();
  }


  // =======================================================
  // FORM CONTROLS
  // =======================================================

  get f() {
    return this.mrForm.controls;
  }


  // =======================================================
  // INITIALIZE FORM
  // =======================================================

  initializeForm(): void {

    this.mrForm =
      this.fb.group({

        name: [
          '',
          Validators.required
        ],

        contactPerson: [
          '',
          Validators.required
        ],

        mobile: [
          '',
          [
            Validators.required,

            Validators.pattern(
              /^[0-9]{10}$/
            )
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        address: [
          '',
          Validators.required
        ],

        city: [
          '',
          Validators.required
        ],

        state: [
          '',
          Validators.required
        ],

        pincode: [
          '',
          [
            Validators.required,

            Validators.pattern(
              /^[0-9]{6}$/
            )
          ]
        ],

        region: [
          '',
          Validators.required
        ],

        // =================================================
        // AREA
        // =================================================

        area: [
          null,
          Validators.required
        ],

        // =================================================
        // MULTIPLE ROUTES
        // =================================================

        routeIds: [
          [],
          Validators.required
        ]
      });
  }


  // =======================================================
  // LOAD AREAS
  // =======================================================

  loadAreas(): void {

    const agencyId =
      Number(this.agencyId);

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

    this.isLoadingAreas = true;


    /*
     * IMPORTANT:
     *
     * This assumes get_all_area()
     * is available inside MrService.
     */

    this.areaManagerService
      .get_all_area({
        agencyId: agencyId,
        isActive: true
      })
      .subscribe({

        next: (res: any) => {

          console.log(
            'Area API Response:',
            res
          );


          this.areas =
            Array.isArray(res?.data)
              ? res.data
              : [];


          console.log(
            'Areas:',
            this.areas
          );


          this.isLoadingAreas = false;
        },


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

            text:
              'Failed to load areas'

          });
        }

      });
  }


  // =======================================================
  // AREA -> ROUTE LISTENER
  // =======================================================

  setupAreaRouteListener(): void {

    this.mrForm
      .get('area')
      ?.valueChanges
      .subscribe(
        (
          areaId: number | null
        ) => {

          console.log(
            'Selected Area ID:',
            areaId
          );


          // ===============================================
          // FIND SELECTED AREA
          // ===============================================

          this.selectedArea =
            this.areas.find(
              area =>
                Number(area.areaId) ===
                Number(areaId)
            ) || null;


          console.log(
            'Selected Area:',
            this.selectedArea
          );


          // ===============================================
          // CLEAR OLD ROUTES
          // ===============================================

          this.mrForm.patchValue(
            {
              routeIds: []
            },
            {
              emitEvent: false
            }
          );


          this.selectedRoutes = [];

          this.routeList = [];

          this.filteredRoutes = [];


          // ===============================================
          // NO AREA
          // ===============================================

          if (!areaId) {

            return;
          }


          // ===============================================
          // LOAD ROUTES FOR AREA
          // ===============================================

          this.getRouteList(
            Number(areaId)
          );
        }
      );
  }


  // =======================================================
  // GET ROUTES BY AGENCY + AREA
  // =======================================================

  getRouteList(
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

      this.routeList = [];

      this.filteredRoutes = [];

      return;
    }


    if (
      !selectedAreaId ||
      selectedAreaId <= 0
    ) {

      console.log(
        'No valid Area ID selected.'
      );

      this.routeList = [];

      this.filteredRoutes = [];

      return;
    }


    this.isLoadingRoutes = true;


    console.log(
      'Loading routes:',
      {
        agencyId:
          agencyId,

        areaId:
          selectedAreaId
      }
    );


    this.customerService
      .getRouteList(
        agencyId,
        selectedAreaId
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Route API Response:',
            res
          );


          if (
            Array.isArray(res)
          ) {

            this.routeList =
              res;

          } else {

            this.routeList =
              Array.isArray(
                res?.data
              )
                ? res.data
                : [];
          }


          this.filteredRoutes =
            [
              ...this.routeList
            ];


          console.log(
            'Route List:',
            this.routeList
          );


          this.isLoadingRoutes =
            false;
        },


        error: (err: any) => {

          console.error(
            'Failed to fetch Route List:',
            err
          );


          this.routeList = [];

          this.filteredRoutes = [];

          this.isLoadingRoutes =
            false;


          Swal.fire({

            icon: 'error',

            title: 'Error',

            text:
              'Failed to load routes.'

          });
        }

      });
  }


  // =======================================================
  // FILTER ROUTES
  // =======================================================

  filterRoutes(): void {

    const search =
      this.routeSearch
        .trim()
        .toLowerCase();


    if (!search) {

      this.filteredRoutes =
        [
          ...this.routeList
        ];

      return;
    }


    this.filteredRoutes =
      this.routeList.filter(
        (
          item: RouteItem
        ) =>
          item.routeName
            ?.toLowerCase()
            .includes(search)
      );
  }


  // =======================================================
  // CHECK ROUTE SELECTED
  // =======================================================

  isSelected(
    routeId: number
  ): boolean {

    const currentIds:
      number[] =
      this.mrForm
        .get('routeIds')
        ?.value || [];


    return currentIds
      .map(
        id => Number(id)
      )
      .includes(
        Number(routeId)
      );
  }


  // =======================================================
  // TOGGLE ROUTE
  // =======================================================

  toggleRoute(
    item: RouteItem
  ): void {

    const routeControl =
      this.mrForm
        .get('routeIds');


    if (!routeControl) {

      return;
    }


    const currentIds:
      number[] =
      [
        ...(routeControl.value || [])
      ]
        .map(
          id => Number(id)
        );


    const routeId =
      Number(item.routeId);


    if (
      currentIds.includes(
        routeId
      )
    ) {

      // REMOVE

      const updatedIds =
        currentIds.filter(
          id =>
            id !== routeId
        );


      routeControl.setValue(
        updatedIds
      );


      this.selectedRoutes =
        this.selectedRoutes.filter(
          route =>
            Number(
              route.routeId
            ) !== routeId
        );

    } else {

      // ADD

      currentIds.push(
        routeId
      );


      routeControl.setValue(
        currentIds
      );


      if (
        !this.selectedRoutes.some(
          route =>
            Number(
              route.routeId
            ) === routeId
        )
      ) {

        this.selectedRoutes.push(
          item
        );
      }
    }


    routeControl.markAsTouched();

    routeControl.markAsDirty();
  }


  // =======================================================
  // REMOVE ROUTE
  // =======================================================

  removeRoute(
    routeId: number
  ): void {

    const routeControl =
      this.mrForm
        .get('routeIds');


    if (!routeControl) {

      return;
    }


    const currentIds:
      number[] =
      [
        ...(routeControl.value || [])
      ]
        .map(
          id => Number(id)
        );


    const updatedIds =
      currentIds.filter(
        id =>
          id !== Number(routeId)
      );


    routeControl.setValue(
      updatedIds
    );


    this.selectedRoutes =
      this.selectedRoutes.filter(
        route =>
          Number(
            route.routeId
          ) !== Number(routeId)
      );


    routeControl.markAsTouched();

    routeControl.markAsDirty();
  }


  // =======================================================
  // SYNC SELECTED ROUTES
  // =======================================================

  private syncSelectedRoutesFromForm(): void {

    const currentIds:
      number[] =
      (
        this.mrForm
          .get('routeIds')
          ?.value || []
      )
        .map(
          (id: any) =>
            Number(id)
        );


    this.selectedRoutes =
      this.routeList.filter(
        route =>
          currentIds.includes(
            Number(
              route.routeId
            )
          )
      );
  }


  // =======================================================
  // OUTSIDE CLICK
  // =======================================================

  @HostListener(
    'document:click',
    ['$event']
  )
  onClickOutside(
    event: MouseEvent
  ): void {

    const dropdownContainer =
      this.eRef.nativeElement
        .querySelector(
          '.route-dropdown-container'
        );


    if (
      dropdownContainer &&
      !dropdownContainer.contains(
        event.target as Node
      )
    ) {

      this.showRouteDropdown =
        false;
    }
  }


  // =======================================================
  // OPEN ROUTE MODAL
  // =======================================================

  openRouteModal(): void {

    this.newRouteName = '';

    this.newRouteDescription = '';

    this.showRouteModal = true;
  }


  // =======================================================
  // CLOSE ROUTE MODAL
  // =======================================================

  closeRouteModal(): void {

    this.showRouteModal = false;

    this.newRouteName = '';

    this.newRouteDescription = '';
  }


  // =======================================================
  // ADD ROUTE
  // =======================================================
addRoute(): void {

  const routeName = this.newRouteName?.trim();

  // ============================================
  // VALIDATE ROUTE NAME
  // ============================================

  if (!routeName) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation',
      text: 'Route Name is required.'
    });

    return;
  }

  // ============================================
  // GET SELECTED AREA ID FROM mrForm
  // ============================================

  const areaId = Number(
    this.mrForm.get('area')?.value
  );

  // ============================================
  // VALIDATE AREA
  // ============================================

  if (!areaId || areaId <= 0) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation',
      text: 'Please select an Area first.'
    });

    return;
  }

  // ============================================
  // CREATE ROUTE PAYLOAD
  // ============================================

  const payload = {
    agencyId: Number(this.agencyId),

    routeName: routeName,

    description:
      this.newRouteDescription?.trim() || '',

    // SELECTED AREA ID
    area: areaId,

    createdby: Number(this.createdBy)
  };

  console.log(
    'Create Route Payload:',
    payload
  );

  // ============================================
  // START LOADING
  // ============================================

  this.isAddingRoute = true;

  // ============================================
  // API CALL
  // ============================================

  this.customerService
    .createRoute(payload)
    .subscribe({

      next: (res: any) => {

        this.isAddingRoute = false;

        console.log(
          'Create Route Response:',
          res
        );

        // ======================================
        // GET NEW ROUTE ID
        // ======================================

        const newRouteId = Number(
          res?.data?.routeId
        );

        // ======================================
        // CLEAR ROUTE FORM
        // ======================================

        this.newRouteName = '';
        this.newRouteDescription = '';

        // ======================================
        // RELOAD ROUTES FOR SAME AREA
        // AND AUTO SELECT NEW ROUTE
        // ======================================

        this.getRouteListAndSelect(
          areaId,
          newRouteId
        );

        // ======================================
        // SUCCESS
        // ======================================

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text:
            res?.message ||
            'Route Added Successfully.'
        });

        // Close modal after successful creation
        this.closeRouteModal();
      },

      error: (err: any) => {

        this.isAddingRoute = false;

        console.error(
          'Create Route Error:',
          err
        );

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            err?.error?.message ||
            'Unable to add route.'
        });
      }

    });
}


  // =======================================================
  // RELOAD ROUTES AND SELECT NEW ROUTE
  // =======================================================

  getRouteListAndSelect(
    areaId: number,
    newRouteId?: number
  ): void {

    this.customerService
      .getRouteList(
        Number(this.agencyId),
        Number(areaId)
      )
      .subscribe({

        next: (res: any) => {

          if (
            Array.isArray(res)
          ) {

            this.routeList =
              res;

          } else {

            this.routeList =
              Array.isArray(
                res?.data
              )
                ? res.data
                : [];
          }


          this.filteredRoutes =
            [
              ...this.routeList
            ];


          const routeControl =
            this.mrForm
              .get('routeIds');


          let currentIds:
            number[] =
            [
              ...(routeControl?.value || [])
            ]
              .map(
                id => Number(id)
              );


          if (
            newRouteId
          ) {

            const newRoute =
              this.routeList.find(
                route =>
                  Number(
                    route.routeId
                  ) ===
                  Number(
                    newRouteId
                  )
              );


            if (
              newRoute &&
              !currentIds.includes(
                Number(
                  newRoute.routeId
                )
              )
            ) {

              currentIds.push(
                Number(
                  newRoute.routeId
                )
              );
            }
          }


          routeControl?.setValue(
            currentIds
          );


          this.selectedRoutes =
            this.routeList.filter(
              route =>
                currentIds.includes(
                  Number(
                    route.routeId
                  )
                )
            );
        },


        error: (err: any) => {

          console.error(
            'Failed to fetch Route List:',
            err
          );
        }

      });
  }


  // =======================================================
  // SAVE MR
  // =======================================================

  saveMr(): void {

    this.submitted = true;


    if (
      this.mrForm.invalid ||
      this.isSaving
    ) {

      this.mrForm.markAllAsTouched();


      Swal.fire({

        icon: 'warning',

        title: 'Validation Error',

        text:
          'Please fill all required fields correctly.'

      });


      return;
    }


    this.isSaving = true;


    // =====================================================
    // ROUTE IDS
    // =====================================================

    const rawRouteIds =
      this.mrForm.value.routeIds || [];


    const formattedRouteIds =
      rawRouteIds.map(
        (id: any) =>
          Number(id)
      );


    // =====================================================
    // AREA ID
    // =====================================================

    const areaId =
      Number(
        this.mrForm.value.area
      );


    // =====================================================
    // PAYLOAD
    // =====================================================

    const payload = {

      agencyId:
        Number(this.agencyId),

      name:
        this.mrForm.value.name,

      contactPerson:
        this.mrForm.value.contactPerson,

      mobile:
        this.mrForm.value.mobile,

      email:
        this.mrForm.value.email,

      address:
        this.mrForm.value.address,

      city:
        this.mrForm.value.city,

      state:
        this.mrForm.value.state,

      pincode:
        this.mrForm.value.pincode,

      region:
        this.mrForm.value.region,

      assignedAreaManager:
        Number(this.managerId),

      // AREA
      area:
        areaId,

      // MULTIPLE ROUTES
      routeIds:
        formattedRouteIds,

      createdBy:
        Number(this.createdBy)
    };


    console.log(
      'Create Medical Representative Payload:',
      payload
    );


    // =====================================================
    // API CALL
    // =====================================================

    this.mrService
      .add_mr(payload)
      .subscribe({

        next: (res: any) => {

          this.isSaving = false;


          if (
            res?.success
          ) {

            Swal.fire({

              icon: 'success',

              title: 'Success',

              text:
                'Medical Representative added successfully'

            });


            this.resetForm();

          } else {

            Swal.fire({

              icon: 'error',

              title: 'Error',

              text:
                res?.message ||
                'Failed to add Medical Representative'

            });
          }
        },


        error: (err: any) => {

          this.isSaving = false;


          console.error(
            'Create MR Error:',
            err
          );


          Swal.fire({

            icon: 'error',

            title: 'Error',

            text:
              err?.error?.message ||
              'Something went wrong'

          });
        }

      });
  }


  // =======================================================
  // RESET FORM
  // =======================================================

  resetForm(): void {

    this.submitted = false;


    this.mrForm.reset({

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

      routeIds: []
    });


    this.selectedArea = null;

    this.selectedRoutes = [];

    this.routeList = [];

    this.filteredRoutes = [];

    this.routeSearch = '';

    this.showRouteDropdown = false;
  }
}