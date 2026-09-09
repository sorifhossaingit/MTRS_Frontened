import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

import {
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  Upload,
  Eye,
  Pencil,
  Trash2,
  X,
  Check
} from 'lucide-angular';

import { CustomerService } from '../../services/customer.service';
import { AreaManagerService } from '../../../area-manager/services/area-manager.service';


@Component({
  selector: 'app-customer-master-dashboard',
  templateUrl: './customer-master-dashboard.component.html',
  styleUrl: './customer-master-dashboard.component.css'
})
export class CustomerMasterDashboardComponent implements OnInit {


  // =========================================================
  // ICONS
  // =========================================================

  readonly Users = Users;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly TrendingUp = TrendingUp;
  readonly Plus = Plus;
  readonly Upload = Upload;
  readonly Eye = Eye;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Check = Check;


  // =========================================================
  // BASIC VARIABLES
  // =========================================================

  agencyId: string | null =
    localStorage.getItem('aid');

  updatedBy = 0;

  rid: string | null =
    localStorage.getItem('rid');

  submitted = false;

  showEditModal = false;

  isLoading = false;


  // =========================================================
  // FORM
  // =========================================================

  customerForm!: FormGroup;


  // =========================================================
  // CUSTOMER DATA
  // =========================================================

  customerList: any[] = [];

  customerTypeList: any[] = [];

  // Routes used inside Edit Customer modal
  routeList: any[] = [];

  // Routes used by the table/filter dropdown
  // This list is agency-wide and is NOT dependent on selected area.
  filterRouteList: any[] = [];

  areas: any[] = [];


  // =========================================================
  // FILTERS
  // =========================================================

  typeFilter: number | null = null;

  routeFilter: number | null = null;

  statusFilter: boolean | null = null;

  stateFilter = '';

  searchText = '';


  // =========================================================
  // SELECTED AREA
  // =========================================================

  selectedAreaId = 0;


  // =========================================================
  // AREA LOADING
  // =========================================================

  isLoadingAreas = false;

  isLoadingRoutes = false;


  // =========================================================
  // DASHBOARD
  // =========================================================

  totalCustomer = 0;

  activeCustomer = 0;

  inactiveCustomer = 0;

  newCustomer = 0;


  // =========================================================
  // PAGINATION
  // =========================================================

  pageNumber = 1;

  pageSize = 10;

  totalRecords = 0;

  totalPages = 0;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private customerService: CustomerService,
    private areaManagerService: AreaManagerService,
    private fb: FormBuilder
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.getUserIdFromToken();

    this.initializeForm();

    this.getDashboardDetails();

    this.getCustomerTypeList();

    this.loadAreas();

    // Filter Route dropdown must load routes for the whole agency.
    // It must NOT depend on the Edit Customer selected area.
    this.loadFilterRoutes();

    this.getCustomerDetails();
  }


  // =========================================================
  // FORM INIT
  // =========================================================

  initializeForm(): void {

    this.customerForm =
      this.fb.group({

        customerId: [0],

        agencyId: [
          Number(this.agencyId || 0)
        ],

        name: [
          '',
          Validators.required
        ],

        type: [
          0,
          Validators.required
        ],

        // -----------------------------------------------------
        // AREA
        // -----------------------------------------------------

        areaId: [
          0,
          Validators.required
        ],

        // -----------------------------------------------------
        // ROUTE
        // -----------------------------------------------------

        routeId: [0],

        registrationNo: [''],

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

        region: [''],

        landline: [''],

        latitude: [0],

        longitude: [0],

        isActive: [true],

        updatedBy: [
          this.updatedBy
        ]

      });
  }


  // =========================================================
  // FORM CONTROLS
  // =========================================================

  get f() {

    return this.customerForm.controls;

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

      this.updatedBy =
        Number(
          decodedToken?.userId ||
          decodedToken?.UserId ||
          decodedToken?.id ||
          0
        );

    } catch (err) {

      console.error(
        'Invalid or corrupted JWT token:',
        err
      );

    }

  }


  // =========================================================
  // ADD CUSTOMER PERMISSION
  // =========================================================

  isAddCustomerAllowed(): boolean {

    return (
      this.rid !==
      'a5fabfee-5506-4e12-bfec-c898fc5af3ae'
    );

  }


  // =========================================================
  // LOAD AREAS
  // =========================================================

  loadAreas(): void {

    const agencyId =
      Number(
        localStorage.getItem('aid')
      ) || 0;


    if (agencyId <= 0) {

      console.error(
        'Invalid Agency ID'
      );

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

          console.log(
            'Area API Response:',
            res
          );


          this.areas =
            Array.isArray(res?.data)
              ? res.data
              : [];


          this.isLoadingAreas = false;


          // ---------------------------------------------------
          // If edit form already has an area
          // ---------------------------------------------------

          const areaId =
            Number(
              this.customerForm
                ?.get('areaId')
                ?.value || 0
            );


          if (areaId > 0) {

            this.selectedAreaId =
              areaId;

            this.getRouteList(
              areaId
            );

          }

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
  // GET AREA NAME
  // =========================================================

  getAreaName(
    areaId: number
  ): string {

    if (!areaId) {

      return '-';
    }


    const area =
      this.areas.find(
        (item: any) =>
          Number(item.areaId) ===
          Number(areaId)
      );


    return (
      area?.areaName ||
      '-'
    );

  }


  // =========================================================
  // GET AREA OBJECT
  // =========================================================

  getArea(
    areaId: number
  ): any {

    if (!areaId) {

      return null;
    }


    return (
      this.areas.find(
        (item: any) =>
          Number(item.areaId) ===
          Number(areaId)
      ) || null
    );

  }


  // =========================================================
  // AREA CHANGE
  // =========================================================

  onAreaChange(
    areaId: any
  ): void {

    const id =
      Number(areaId || 0);


    this.selectedAreaId =
      id;


    // Clear route when area changes

    this.customerForm.patchValue(
      {
        routeId: 0
      },
      {
        emitEvent: false
      }
    );


    if (id <= 0) {

      this.routeList = [];

      return;
    }


    this.getRouteList(id);

  }


  // =========================================================
  // ROUTE LIST
  // =========================================================

  getRouteList(
    areaId?: number
  ): void {

    const agencyId =
      Number(
        this.agencyId || 0
      );


    const selectedArea =
      Number(
        areaId ||
        this.selectedAreaId ||
        this.customerForm
          ?.get('areaId')
          ?.value ||
        0
      );


    if (agencyId <= 0) {

      console.error(
        'Invalid Agency ID'
      );

      this.routeList = [];

      return;
    }


    if (selectedArea <= 0) {

      this.routeList = [];

      return;
    }


    this.isLoadingRoutes = true;


    this.customerService
      .getRouteList(
        agencyId,
        selectedArea
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Route API Response:',
            res
          );


          this.routeList =
            Array.isArray(res)
              ? res
              : (
                Array.isArray(res?.data)
                  ? res.data
                  : []
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

        }

      });

  }


  // =========================================================
  // FILTER ROUTE LIST
  // =========================================================
  // Loads ALL routes for the agency.
  // This is intentionally separate from getRouteList(), which is
  // used by the Edit Customer Area -> Route dependency.
  // =========================================================

  loadFilterRoutes(): void {

    const agencyId =
      Number(this.agencyId || 0);

    if (agencyId <= 0) {

      console.error('Invalid Agency ID');

      this.filterRouteList = [];

      return;
    }

    this.customerService
      .getRouteList(agencyId)
      .subscribe({

        next: (res: any) => {

          console.log(
            'Agency Route Filter API Response:',
            res
          );

          this.filterRouteList =
            Array.isArray(res)
              ? res
              : (
                Array.isArray(res?.data)
                  ? res.data
                  : []
              );

        },

        error: (err: any) => {

          console.error(
            'Failed to fetch agency routes for filter:',
            err
          );

          this.filterRouteList = [];

        }

      });

  }


  // =========================================================
  // CUSTOMER TYPE LIST
  // =========================================================

  getCustomerTypeList(): void {

    const agencyId =
      Number(this.agencyId || 0);


    this.customerService
      .getCustomerTypeList(
        agencyId
      )
      .subscribe({

        next: (res: any) => {

          this.customerTypeList =
            Array.isArray(res)
              ? res
              : (
                Array.isArray(res?.data)
                  ? res.data
                  : []
              );

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
  // DASHBOARD DETAILS
  // =========================================================

  getDashboardDetails(): void {

    const params = {

      agencyId:
        this.agencyId

    };


    this.customerService
      .getcustomerdashboarddetails(
        params
      )
      .subscribe({

        next: (res: any) => {

          this.totalCustomer =
            res?.totalCustomers || 0;

          this.activeCustomer =
            res?.activeCustomers || 0;

          this.inactiveCustomer =
            res?.inactiveCustomers || 0;

          this.newCustomer =
            res?.newCustomersThisMonth || 0;

        },

        error: (err: any) => {

          console.error(
            'Failed to fetch Dashboard Details:',
            err
          );

        }

      });

  }


  // =========================================================
  // CUSTOMER DETAILS
  // =========================================================

  getCustomerDetails(): void {

    const rawParams: Record<string, any> = {

      agencyId:
        this.agencyId,

      pageNumber:
        this.pageNumber,

      search:
        this.searchText.trim() ||
        null,

      type:
        this.typeFilter,

      state:
        this.stateFilter.trim() ||
        null,

      isActive:
        this.statusFilter,

      routeId:
        this.routeFilter,

      createdBy:
        this.rid ===
        'a5fabfee-5506-4e12-bfec-c898fc5af3ae'
          ? null
          : this.updatedBy

    };


    const params: any = {};


    Object.keys(rawParams)
      .forEach(
        key => {

          const value =
            rawParams[key];


          if (
            value !== null &&
            value !== undefined &&
            value !== ''
          ) {

            params[key] =
              value;

          }

        }
      );


    this.customerService
      .getcustomerdetails(
        params
      )
      .subscribe({

        next: (res: any) => {

          this.customerList =
            Array.isArray(res?.data)
              ? res.data
              : [];


          this.totalRecords =
            Number(
              res?.totalCount || 0
            );


          this.pageSize =
            Number(
              res?.pageSize || 10
            );


          this.totalPages =
            Math.ceil(
              this.totalRecords /
              this.pageSize
            );

        },

        error: (err: any) => {

          console.error(
            'Failed to fetch Customer Details:',
            err
          );


          this.customerList = [];

        }

      });

  }


  // =========================================================
  // RESET FILTER
  // =========================================================

  resetFilter(): void {

    this.searchText = '';

    this.typeFilter = null;

    this.routeFilter = null;

    this.statusFilter = null;

    this.stateFilter = '';

    this.pageNumber = 1;


    this.getCustomerDetails();

  }


  // =========================================================
  // EDIT CUSTOMER
  // =========================================================

  editCustomer(
    data: any
  ): void {

    console.log(
      'Editing Customer:',
      data
    );


    this.showEditModal = true;

    this.submitted = false;


    // -------------------------------------------------------
    // CUSTOMER TYPE
    // -------------------------------------------------------

    let typeId =
      Number(
        data.customerTypeId ||
        data.typeId ||
        data.type ||
        0
      );


    if (
      !typeId &&
      (
        data.type ||
        data.customerType
      )
    ) {

      const matchedType =
        this.customerTypeList.find(
          (item: any) =>
            item.customerType ===
            (
              data.type ||
              data.customerType
            )
        );


      if (matchedType) {

        typeId =
          Number(
            matchedType.customerTypeId
          );

      }

    }


    // -------------------------------------------------------
    // AREA
    // -------------------------------------------------------

    const areaId =
      Number(
        data.areaId ||
        data.area ||
        0
      );


    this.selectedAreaId =
      areaId;


    // -------------------------------------------------------
    // PATCH FORM
    // -------------------------------------------------------

    this.customerForm.patchValue({

      customerId:
        Number(
          data.customerId || 0
        ),

      agencyId:
        Number(
          this.agencyId || 0
        ),

      name:
        data.name || '',

      type:
        typeId,

      areaId:
        areaId,

      routeId:
        Number(
          data.routeId || 0
        ),

      registrationNo:
        data.registrationNo || '',

      contactPerson:
        data.contactPerson || '',

      mobile:
        data.mobile || '',

      email:
        data.email || '',

      address:
        data.address || '',

      city:
        data.city || '',

      state:
        data.state || '',

      pincode:
        data.pincode || '',

      gstNo:
        data.gstNo || '',

      drugLicenseNo:
        data.drugLicenseNo || '',

      panNo:
        data.panNo || '',

      region:
        data.region || '',

      landline:
        data.landline || '',

      latitude:
        Number(
          data.latitude || 0
        ),

      longitude:
        Number(
          data.longitude || 0
        ),

      isActive:
        data.isActive ??
        true,

      updatedBy:
        this.updatedBy

    });


    // -------------------------------------------------------
    // LOAD ROUTES FOR CUSTOMER AREA
    // -------------------------------------------------------

    if (areaId > 0) {

      this.getRouteList(
        areaId
      );

    } else {

      this.routeList = [];

    }

  }


  // =========================================================
  // UPDATE CUSTOMER
  // =========================================================

  updateCustomer(): void {

    this.submitted = true;


    if (
      this.customerForm.invalid ||
      Number(
        this.customerForm.value.type
      ) === 0 ||
      Number(
        this.customerForm.value.areaId
      ) === 0
    ) {

      this.customerForm.markAllAsTouched();


      Swal.fire({

        icon: 'warning',

        title: 'Validation Error',

        text:
          'Please select a valid Customer Type, Area and complete all required fields.',

        confirmButtonColor:
          '#f59e0b'

      });


      return;

    }


    this.isLoading = true;


    const formValues =
      this.customerForm.value;


    // =======================================================
    // EXACT UPDATE PAYLOAD
    // =======================================================

    const payload = {

      customerId:
        Number(
          formValues.customerId || 0
        ),

      agencyId:
        Number(
          this.agencyId || 0
        ),

      name:
        formValues.name,

      type:
        Number(
          formValues.type || 0
        ),

      // IMPORTANT
      // Update API expects areaId

      areaId:
        Number(
          formValues.areaId || 0
        ),

      routeId:
        Number(
          formValues.routeId || 0
        ),

      registrationNo:
        formValues.registrationNo,

      contactPerson:
        formValues.contactPerson,

      mobile:
        formValues.mobile,

      email:
        formValues.email,

      address:
        formValues.address,

      city:
        formValues.city,

      state:
        formValues.state,

      pincode:
        formValues.pincode,

      gstNo:
        formValues.gstNo,

      drugLicenseNo:
        formValues.drugLicenseNo,

      panNo:
        formValues.panNo,

      isActive:
        formValues.isActive,

      updatedBy:
        this.updatedBy,

      region:
        formValues.region,

      landline:
        formValues.landline,

      latitude:
        Number(
          formValues.latitude || 0
        ),

      longitude:
        Number(
          formValues.longitude || 0
        )

    };


    console.log(
      'UPDATE CUSTOMER PAYLOAD:',
      payload
    );


    this.customerService
      .updatecustomerdetails(
        payload
      )
      .pipe(

        finalize(() => {

          this.isLoading = false;

        })

      )
      .subscribe({

        next: (res: any) => {

          Swal.fire({

            icon: 'success',

            title: 'Success',

            text:
              res?.message ||
              'Customer Updated Successfully',

            confirmButtonColor:
              '#16a34a'

          });


          this.closeModal();

          this.getCustomerDetails();

          this.getDashboardDetails();

        },

        error: (err: any) => {

          console.error(
            'Update Failed:',
            err
          );


          Swal.fire({

            icon: 'error',

            title: 'Update Failed',

            text:
              err?.error?.message ||
              err?.error?.title ||
              'Something went wrong',

            confirmButtonColor:
              '#dc2626'

          });

        }

      });

  }


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  closeModal(): void {

    this.showEditModal = false;

    this.submitted = false;


    this.selectedAreaId = 0;

    this.routeList = [];


    this.customerForm.reset({

      customerId: 0,

      agencyId:
        Number(
          this.agencyId || 0
        ),

      name: '',

      type: 0,

      areaId: 0,

      routeId: 0,

      registrationNo: '',

      contactPerson: '',

      mobile: '',

      email: '',

      address: '',

      city: '',

      state: '',

      pincode: '',

      gstNo: '',

      drugLicenseNo: '',

      panNo: '',

      region: '',

      landline: '',

      latitude: 0,

      longitude: 0,

      isActive: true,

      updatedBy:
        this.updatedBy

    });

  }


  // =========================================================
  // PAGINATION
  // =========================================================

  nextPage(): void {

    if (
      this.pageNumber <
      this.totalPages
    ) {

      this.pageNumber++;

      this.getCustomerDetails();

    }

  }


  previousPage(): void {

    if (
      this.pageNumber > 1
    ) {

      this.pageNumber--;

      this.getCustomerDetails();

    }

  }


  changePageSize(
    event: Event
  ): void {

    const target =
      event.target as
      HTMLSelectElement;


    this.pageSize =
      Number(
        target.value
      );


    this.pageNumber = 1;


    this.getCustomerDetails();

  }


  // =========================================================
  // DELETE CUSTOMER
  // =========================================================

  deleteCustomer(
    item: any
  ): void {

    Swal.fire({

      title:
        'Delete Customer?',

      text:
        `Are you sure you want to delete ${item.name}?`,

      icon:
        'warning',

      showCancelButton:
        true,

      confirmButtonText:
        'Yes, Delete',

      cancelButtonText:
        'Cancel',

      confirmButtonColor:
        '#dc2626',

      cancelButtonColor:
        '#6b7280'

    }).then(
      (result) => {

        if (
          !result.isConfirmed
        ) {

          return;
        }


        const payload = {

          customerId:
            Number(
              item.customerId || 0
            ),

          agencyId:
            Number(
              this.agencyId || 0
            ),

          name:
            item.name || '',

          type:
            Number(
              item.typeId ||
              item.type ||
              0
            ),

          // IMPORTANT
          // Delete also uses areaId

          areaId:
            Number(
              item.areaId ||
              item.area ||
              0
            ),

          registrationNo:
            item.registrationNo || '',

          contactPerson:
            item.contactPerson || '',

          mobile:
            item.mobile || '',

          email:
            item.email || '',

          address:
            item.address || '',

          city:
            item.city || '',

          state:
            item.state || '',

          pincode:
            item.pincode || '',

          gstNo:
            item.gstNo || '',

          drugLicenseNo:
            item.drugLicenseNo || '',

          panNo:
            item.panNo || '',

          updatedBy:
            this.updatedBy,

          region:
            item.region || '',

          landline:
            item.landline || '',

          latitude:
            Number(
              item.latitude || 0
            ),

          longitude:
            Number(
              item.longitude || 0
            ),

          routeId:
            Number(
              item.routeId || 0
            ),

          isActive:
            false

        };


        Swal.fire({

          title:
            'Deleting...',

          text:
            'Please wait',

          allowOutsideClick:
            false,

          allowEscapeKey:
            false,

          didOpen: () => {

            Swal.showLoading();

          }

        });


        this.customerService
          .updatecustomerdetails(
            payload
          )
          .subscribe({

            next: () => {

              Swal.fire({

                icon:
                  'success',

                title:
                  'Deleted',

                text:
                  'Customer Deleted Successfully',

                confirmButtonColor:
                  '#16a34a'

              });


              this.getCustomerDetails();

              this.getDashboardDetails();

            },

            error: (err: any) => {

              console.error(
                'Delete Failed:',
                err
              );


              Swal.fire({

                icon:
                  'error',

                title:
                  'Delete Failed',

                text:
                  err?.error?.message ||
                  err?.error?.title ||
                  'Something went wrong',

                confirmButtonColor:
                  '#dc2626'

              });

            }

          });

      }
    );

  }


  // =========================================================
  // UPDATE STATUS
  // =========================================================

  updateCustomerStatus(
    item: any,
    status: number
  ): void {

    const action =
      status === 2
        ? 'Approve'
        : 'Reject';


    Swal.fire({

      title:
        `${action} Customer?`,

      text:
        `Are you sure you want to ${action.toLowerCase()} this customer?`,

      icon:
        'question',

      showCancelButton:
        true,

      confirmButtonText:
        'Yes',

      cancelButtonText:
        'No',

      confirmButtonColor:
        status === 2
          ? '#16a34a'
          : '#dc2626'

    }).then(
      (result) => {

        if (
          !result.isConfirmed
        ) {

          return;
        }


        const payload = {

          customerId:
            Number(
              item.customerId
            ),

          agencyId:
            Number(
              this.agencyId || 0
            ),

          status:
            status,

          approvedBy:
            this.updatedBy

        };


        this.customerService
          .updateCustomerStatus(
            payload
          )
          .subscribe({

            next: () => {

              Swal.fire({

                icon:
                  'success',

                title:
                  'Success',

                text:
                  `Customer ${action.toLowerCase()}d successfully.`,

                confirmButtonColor:
                  '#16a34a'

              });


              this.getCustomerDetails();

              this.getDashboardDetails();

            },

            error: (err: any) => {

              console.error(
                err
              );


              Swal.fire({

                icon:
                  'error',

                title:
                  'Failed',

                text:
                  err?.error?.message ||
                  'Something went wrong.'

              });

            }

          });

      }
    );

  }

}