import { Component, OnInit } from '@angular/core';
import {
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText,
  Users,
  Save,
  Plus
} from 'lucide-angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CustomerService } from '../../services/customer.service';
import { AreaManagerService } from '../../../area-manager/services/area-manager.service';
import { HttpClient } from '@angular/common/http';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';

@Component({
  selector: 'app-add-customer-master',
  templateUrl: './add-customer-master.component.html',
  styleUrl: './add-customer-master.component.css'
})
export class AddCustomerMasterComponent implements OnInit {

  // =========================================================
  // ICONS
  // =========================================================

  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  User = User;
  Phone = Phone;
  MapPin = MapPin;
  FileText = FileText;
  Users = Users;
  Save = Save;
  Plus = Plus;


  // =========================================================
  // CUSTOMER TYPE
  // =========================================================

  showCustomerTypeModal = false;
  isAddingCustomerType = false;
  newCustomerType = '';

  customerTypeList: any[] = [];


  // =========================================================
  // FORM
  // =========================================================

  customerForm!: FormGroup;
  submitted = false;


  // =========================================================
  // ROUTE
  // =========================================================

  routeList: any[] = [];

  showRouteModal = false;

  newRouteName = '';
  newRouteDescription = '';

  isAddingRoute = false;

  // Optional: useful for route loading UI
  isLoadingRoutes = false;


  // =========================================================
  // AREA
  // =========================================================

  areas: any[] = [];
  isLoadingAreas = false;


  // =========================================================
  // AREA MANAGER
  // =========================================================

  loggedInAreaManagerId: number | null = null;
  medicalRepresentativeId: number | null = null;

  areaManagerList: any[] = [];


  // =========================================================
  // AGENCY / USER
  // =========================================================

  agencyId: any =
    localStorage.getItem('aid');

  createdBy: any;


  // =========================================================
  // MAP
  // =========================================================

  map!: Map | null;

  vectorSource = new VectorSource();

  vectorLayer!: VectorLayer;

  showMapModal = false;


selectedArea: any = null;

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private areaManagerService: AreaManagerService,
    private router: Router,
    private http: HttpClient
  ) { }


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.getUserIdFromToken();

    this.initializeForm();

    this.getAreaManagerList();

    this.getCustomerTypeList();

    this.getAreaManagerForUpdateCustomer();

    this.loadAreas();

    // IMPORTANT:
    // Route is loaded only after Area is selected
    this.setupAreaRouteListener();
  }


  // =========================================================
  // FORM
  // =========================================================

  initializeForm(): void {

    this.customerForm = this.fb.group({

      agencyId: [this.agencyId],

      name: [
        '',
        Validators.required
      ],

      type: [
        null,
        Validators.required
      ],

      registrationNo: [
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
          Validators.pattern(/^[0-9]{10}$/)
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
        Validators.required
      ],

      gstNo: [''],

      drugLicenseNo: [''],

      panNo: [''],

      // AREA
      area: [
        null,
        Validators.required
      ],

      assignedAreaManager: [0],

      // ROUTE
      routeId: [
        null,
        Validators.required
      ],

      region: [''],

      landline: [''],

      latitude: [
        null,
        Validators.required
      ],

      longitude: [
        null,
        Validators.required
      ],

      createdBy: [0]
    });
  }


  // =========================================================
  // AREA LIST
  // =========================================================

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

next: (res: any) => {

  console.log('Area API Response:', res);

  this.areas =
    Array.isArray(res?.data)
      ? res.data
      : [];

  console.log('Areas:', this.areas);

  // Set selected area object if area is already selected
  const selectedAreaId =
    Number(this.customerForm.get('area')?.value);

  if (selectedAreaId > 0) {

    this.selectedArea =
      this.areas.find(
        area =>
          Number(area.areaId) === selectedAreaId
      ) || null;
  }

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
            text: 'Failed to load areas'
          });
        }

      });
  }


  // =========================================================
  // AREA -> ROUTE LISTENER
  // =========================================================
setupAreaRouteListener(): void {

  this.customerForm
    .get('area')
    ?.valueChanges
    .subscribe((areaId: number | null) => {

      console.log('Selected Area ID:', areaId);

      // Find selected area object
      this.selectedArea =
        this.areas.find(
          area =>
            Number(area.areaId) === Number(areaId)
        ) || null;

      console.log('Selected Area:', this.selectedArea);

      // Clear previous selected route
      this.customerForm.patchValue(
        {
          routeId: null
        },
        {
          emitEvent: false
        }
      );

      // Clear old route list
      this.routeList = [];

      // No area selected
      if (!areaId) {
        return;
      }

      // Load routes for selected area
      this.getRouteList(Number(areaId));
    });
}


  // =========================================================
  // GET ROUTES BY AGENCY + AREA
  // =========================================================

  getRouteList(areaId: number): void {

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

      return;
    }

    this.isLoadingRoutes = true;

    console.log(
      'Loading routes:',
      {
        agencyId: agencyId,
        areaId: selectedAreaId
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

          /*
           * Supports:
           * {
           *   success: true,
           *   data: [...]
           * }
           *
           * and direct array response.
           */

          if (Array.isArray(res)) {

            this.routeList = res;

          } else {

            this.routeList =
              Array.isArray(res?.data)
                ? res.data
                : [];
          }

          console.log(
            'Route List:',
            this.routeList
          );

          this.isLoadingRoutes = false;
        },

        error: (err: any) => {

          console.error(
            'Failed to fetch Route List:',
            err
          );

          this.routeList = [];

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
  // MAP
  // =========================================================

  openMap(): void {

    this.showMapModal = true;

    if (!navigator.geolocation) {

      Swal.fire(
        'Error',
        'Geolocation is not supported by your browser.',
        'error'
      );

      setTimeout(
        () => this.loadMap(),
        300
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        this.customerForm.patchValue({
          latitude,
          longitude
        });

        setTimeout(
          () => this.loadMap(),
          300
        );
      },

      (error) => {

        console.error(
          'Geolocation Error:',
          error
        );

        Swal.fire(
          'Location Error',
          'Unable to get your current location.',
          'error'
        );

        setTimeout(
          () => this.loadMap(),
          300
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }


  // =========================================================
  // LOAD MAP
  // =========================================================

  loadMap(): void {

    if (this.map) {

      this.map.setTarget(undefined);

      this.map = null;
    }

    const lat =
      this.customerForm
        .get('latitude')
        ?.value || 22.5726;

    const lng =
      this.customerForm
        .get('longitude')
        ?.value || 88.3639;

    this.vectorSource.clear();

    this.vectorLayer =
      new VectorLayer({

        source:
          this.vectorSource,

        style:
          new Style({

            image:
              new Icon({

                anchor: [
                  0.5,
                  1
                ],

                src:
                  'https://openlayers.org/en/latest/examples/data/icon.png',

                scale: 1
              })
          })
      });


    this.map =
      new Map({

        target: 'map',

        layers: [

          new TileLayer({
            source: new OSM()
          }),

          this.vectorLayer
        ],

        view:
          new View({

            center:
              fromLonLat([
                lng,
                lat
              ]),

            zoom: 16
          })
      });


    const coordinate =
      fromLonLat([
        lng,
        lat
      ]);

    this.updateMarkerAndForm(
      coordinate
    );


    this.map.on(
      'singleclick',
      (event) => {

        this.updateMarkerAndForm(
          event.coordinate
        );
      }
    );


    setTimeout(() => {

      this.map?.updateSize();

    }, 100);
  }


  // =========================================================
  // ADDRESS SEARCH
  // =========================================================

  searchAddress(
    query: string
  ): void {

    if (
      !query ||
      !query.trim()
    ) {

      return;
    }

    const url =
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

    this.http
      .get<any[]>(url)
      .subscribe({

        next: (
          results: string | any[]
        ) => {

          if (
            results &&
            results.length > 0
          ) {

            const location =
              results[0];

            const lat =
              parseFloat(
                location.lat
              );

            const lon =
              parseFloat(
                location.lon
              );

            const olCoordinates =
              fromLonLat([
                lon,
                lat
              ]);

            this.updateMarkerAndForm(
              olCoordinates
            );


            if (this.map) {

              this.map
                .getView()
                .animate({

                  center:
                    olCoordinates,

                  zoom: 15,

                  duration: 800
                });
            }

          } else {

            Swal.fire({

              icon: 'info',

              title:
                'No Location Found',

              text:
                'Could not find any results matching that address. Please try something more specific.',

              confirmButtonColor:
                '#3b82f6'
            });
          }
        },

        error: (err: any) => {

          console.error(
            'Geocoding Error:',
            err
          );

          Swal.fire({

            icon: 'error',

            title:
              'Search Failed',

            text:
              'Something went wrong while looking up the address.',

            confirmButtonColor:
              '#dc2626'
          });
        }

      });
  }


  // =========================================================
  // UPDATE MAP MARKER + FORM
  // =========================================================

  private updateMarkerAndForm(
    coordinate: any
  ): void {

    const lonLat =
      toLonLat(coordinate);

    const lng =
      lonLat[0];

    const lat =
      lonLat[1];

    this.vectorSource.clear();


    const markerFeature =
      new Feature({

        geometry:
          new Point(coordinate)
      });


    this.vectorSource.addFeature(
      markerFeature
    );


    this.customerForm.patchValue({

      latitude:
        parseFloat(
          lat.toFixed(6)
        ),

      longitude:
        parseFloat(
          lng.toFixed(6)
        )
    });


    this.customerForm
      .get('latitude')
      ?.markAsTouched();
  }


  // =========================================================
  // AREA MANAGER LIST
  // =========================================================

  getAreaManagerList(): void {

    this.customerService
      .getAreamanagerlist(
        this.agencyId
      )
      .subscribe({

        next: (res: any) => {

          this.areaManagerList =
            res?.data || [];
        },

        error: (err: any) => {

          console.error(
            'Failed to fetch Area Manager List:',
            err
          );
        }

      });
  }


  // =========================================================
  // GET LOGGED-IN MR AREA MANAGER
  // =========================================================

  getAreaManagerForUpdateCustomer(): void {

    const agencyId =
      Number(
        localStorage.getItem('aid')
      );

    const medicalRepresentativeId =
      Number(
        localStorage.getItem('mid')
      );


    if (
      !agencyId ||
      !medicalRepresentativeId
    ) {

      console.error(
        'Agency ID or Medical Representative ID not found.'
      );

      return;
    }


    this.customerService
      .getAreaManagerForUpdateCustomer(
        agencyId,
        medicalRepresentativeId
      )
      .subscribe({

        next: (res: any) => {

          if (res?.success) {

            this.loggedInAreaManagerId =
              Number(
                res.areaManagerId
              );

            console.log(
              'Logged-in MR Area Manager ID:',
              this.loggedInAreaManagerId
            );
          }
        },

        error: (err: any) => {

          console.error(
            'Failed to get Area Manager:',
            err
          );
        }

      });
  }


  // =========================================================
  // AREA MANAGER ACCESS
  // =========================================================

  isAreaManagerAllowed(
    am: any
  ): boolean {

    if (
      this.loggedInAreaManagerId === null
    ) {

      return true;
    }

    return (
      Number(am.areaManagerId) ===
      this.loggedInAreaManagerId
    );
  }


  // =========================================================
  // TOKEN
  // =========================================================

  getUserIdFromToken(): void {

    const token =
      localStorage.getItem('token');

    if (!token) {

      return;
    }

    try {

      const decodedToken: any =
        jwtDecode(token);

      this.createdBy =
        decodedToken?.userId ||
        decodedToken?.UserId ||
        decodedToken?.id;

    } catch (error) {

      console.error(
        'Failed to decode token:',
        error
      );
    }
  }


  // =========================================================
  // SAVE CUSTOMER
  // =========================================================

  saveCustomer(): void {

    this.submitted = true;

    if (
      this.customerForm.invalid
    ) {

      this.customerForm.markAllAsTouched();

      Swal.fire({

        icon: 'warning',

        title:
          'Validation Error',

        text:
          'Please fill all required fields correctly.',

        confirmButtonColor:
          '#f59e0b'
      });

      return;
    }


    const formValue =
      this.customerForm.value;


    const payload = {

      agencyId:
        Number(this.agencyId),

      name:
        formValue.name,

      type:
        Number(formValue.type),

      registrationNo:
        formValue.registrationNo,

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

      gstNo:
        formValue.gstNo,

      drugLicenseNo:
        formValue.drugLicenseNo,

      panNo:
        formValue.panNo,

      isActive:
        true,

      // SELECTED AREA ID
      area:
        Number(formValue.area),

      createdBy:
        Number(this.createdBy),

      region:
        formValue.region,

      landline:
        formValue.landline,

      latitude:
        Number(formValue.latitude),

      longitude:
        Number(formValue.longitude),

      // SELECTED ROUTE ID
      routeId:
        Number(formValue.routeId)
    };


    console.log(
      'Customer Payload:',
      payload
    );


    this.customerService
      .addcustomer(payload)
      .subscribe({

        next: (res: any) => {

          Swal.fire({

            icon: 'success',

            title:
              'Success',

            text:
              'Customer Added Successfully',

            confirmButtonColor:
              '#16a34a'

          }).then(() => {

            this.router.navigate([
              '/medical-representative-master/customer-dashboard'
            ]);

          });
        },

        error: (err: any) => {

          console.error(
            'Save Customer Error:',
            err
          );

          Swal.fire({

            icon: 'error',

            title:
              'Failed',

            text:
              err?.error?.message ||
              'Something went wrong',

            confirmButtonColor:
              '#dc2626'
          });
        }

      });
  }


  // =========================================================
  // FORM CONTROLS
  // =========================================================

  get f() {

    return this.customerForm.controls;
  }


  // =========================================================
  // SUBMIT LOCATION
  // =========================================================

  submitLocation(): void {

    if (
      !this.customerForm
        .get('latitude')
        ?.value ||
      !this.customerForm
        .get('longitude')
        ?.value
    ) {

      Swal.fire({

        icon: 'warning',

        title:
          'Select Location',

        text:
          'Please select a location on the map first.'
      });

      return;
    }


    this.showMapModal = false;


    Swal.fire({

      icon: 'success',

      title:
        'Location Selected',

      text:
        'Location has been saved successfully.',

      timer: 1500,

      showConfirmButton: false
    });
  }


  // =========================================================
  // CUSTOMER TYPE LIST
  // =========================================================

  getCustomerTypeList(): void {

    const agencyId =
      Number(this.agencyId);

    this.customerService
      .getCustomerTypeList(
        agencyId
      )
      .subscribe({

        next: (res: any) => {

          this.customerTypeList =
            res?.data ||
            res ||
            [];
        },

        error: (err: any) => {

          console.error(
            'Failed to fetch Customer Types:',
            err
          );
        }

      });
  }


  // =========================================================
  // CUSTOMER TYPE MODAL
  // =========================================================

  openCustomerTypeModal(): void {

    this.showCustomerTypeModal = true;
  }


  // =========================================================
  // ADD CUSTOMER TYPE
  // =========================================================

  addCustomerType(): void {

    if (
      this.isAddingCustomerType
    ) {

      return;
    }


    if (
      !this.newCustomerType.trim()
    ) {

      Swal.fire(
        'Validation',
        'Enter Customer Type',
        'warning'
      );

      return;
    }


    const payload = {

      agencyId:
        Number(this.agencyId),

      customerType:
        this.newCustomerType.trim(),

      createdby:
        Number(this.createdBy)
    };


    console.log(
      'Customer Type Payload:',
      payload
    );


    this.isAddingCustomerType =
      true;


    this.customerService
      .createCustomerType(
        payload
      )
      .subscribe({

        next: (res: any) => {

          this.isAddingCustomerType =
            false;

          Swal.fire(
            'Success',
            res?.message ||
            'Customer Type Added',
            'success'
          );

          this.newCustomerType = '';

          this.getCustomerTypeList();
        },

        error: (err: any) => {

          this.isAddingCustomerType =
            false;

          console.error(
            err
          );

          Swal.fire(
            'Error',
            err?.error?.message ||
            'Unable to add customer type',
            'error'
          );
        }

      });
  }


  // =========================================================
  // DELETE CUSTOMER TYPE
  // =========================================================

  deleteCustomerType(
    id: number
  ): void {

    Swal.fire({

      title:
        'Delete Customer Type?',

      icon:
        'warning',

      showCancelButton:
        true,

      confirmButtonText:
        'Delete'

    }).then(result => {

      if (
        result.isConfirmed
      ) {

        this.http
          .delete(
            `https://localhost:7078/api/v1/admin/customer/delete-customertype/${id}`
          )
          .subscribe({

            next: () => {

              Swal.fire(
                'Deleted',
                'Customer Type Deleted',
                'success'
              );

              this.getCustomerTypeList();
            },

            error: (err) => {

              console.error(
                err
              );

              Swal.fire(
                'Error',
                'Unable to delete customer type',
                'error'
              );
            }

          });
      }

    });
  }


  // =========================================================
  // OPEN ROUTE MODAL
  // =========================================================

  openRouteModal(): void {

    const areaId =
      Number(
        this.customerForm
          .get('area')
          ?.value
      );

    if (
      !areaId ||
      areaId <= 0
    ) {

      Swal.fire(
        'Validation',
        'Please select an Area first.',
        'warning'
      );

      return;
    }


    this.showRouteModal = true;

    // Make sure modal list belongs to selected area
    this.getRouteList(areaId);
  }


  // =========================================================
  // ADD ROUTE
  // =========================================================

  addRoute(): void {

    if (
      this.isAddingRoute
    ) {

      return;
    }


    if (
      !this.newRouteName.trim()
    ) {

      Swal.fire(
        'Validation',
        'Route Name is required.',
        'warning'
      );

      return;
    }


    const areaId =
      Number(
        this.customerForm
          .get('area')
          ?.value
      );


    if (
      !areaId ||
      areaId <= 0
    ) {

      Swal.fire(
        'Validation',
        'Please select an Area first.',
        'warning'
      );

      return;
    }


    const payload = {

      agencyId:
        Number(this.agencyId),

      routeName:
        this.newRouteName.trim(),

      description:
        this.newRouteDescription
          ?.trim() || '',

      // IMPORTANT:
      // Selected Area ID
      area:
        areaId,

      createdby:
        Number(this.createdBy)
    };


    console.log(
      'Create Route Payload:',
      payload
    );


    this.isAddingRoute = true;


    this.customerService
      .createRoute(payload)
      .subscribe({

        next: (res: any) => {

          this.isAddingRoute =
            false;


          Swal.fire(
            'Success',
            res?.message ||
            'Route Added Successfully.',
            'success'
          );


          this.newRouteName = '';

          this.newRouteDescription = '';


          // Reload routes for current area
          this.getRouteList(
            areaId
          );
        },

        error: (err: any) => {

          this.isAddingRoute =
            false;

          console.error(
            'Create Route Error:',
            err
          );

          Swal.fire(
            'Error',
            err?.error?.message ||
            'Unable to add route.',
            'error'
          );
        }

      });
  }


  // =========================================================
  // DELETE ROUTE
  // =========================================================

  deleteRoute(
    id: number
  ): void {

    Swal.fire({

      title:
        'Delete Route?',

      icon:
        'warning',

      showCancelButton:
        true,

      confirmButtonText:
        'Delete'

    }).then(result => {

      if (
        !result.isConfirmed
      ) {

        return;
      }


      this.http
        .delete(
          `https://localhost:7078/api/v1/admin/customer/delete-route/${id}`
        )
        .subscribe({

          next: () => {

            Swal.fire(
              'Deleted',
              'Route Deleted Successfully',
              'success'
            );


            // Reload only selected area's routes
            const areaId =
              Number(
                this.customerForm
                  .get('area')
                  ?.value
              );


            if (
              areaId > 0
            ) {

              this.getRouteList(
                areaId
              );

            } else {

              this.routeList = [];
            }
          },

          error: (err) => {

            console.error(
              err
            );

            Swal.fire(
              'Error',
              'Unable to delete route.',
              'error'
            );
          }

        });

    });
  }

}