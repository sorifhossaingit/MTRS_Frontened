
import { Component, OnInit } from '@angular/core';

import {
  Building2,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  Wallet,
  BadgeIndianRupee,
  X,
  KeyRound,
  XCircle,
  TrendingUp,
  Upload,
  RotateCcw,
  MapPin,
  Save
} from 'lucide-angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { jwtDecode } from 'jwt-decode';

import { StockistService } from '../../services/stockist.service';

// import { AreaManagerService } from '../../services/area-manager.service';
import { AreaManagerService } from '../../../area-manager/services/area-manager.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-stockist-master-dashboard',
  templateUrl: './stockist-master-dashboard.component.html',
  styleUrl: './stockist-master-dashboard.component.css'
})
export class StockistMasterDashboardComponent implements OnInit {

  // =====================================================
  // ICONS
  // =====================================================

  Building2 = Building2;
  Plus = Plus;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;
  CheckCircle = CheckCircle;
  Wallet = Wallet;
  BadgeIndianRupee = BadgeIndianRupee;
  X = X;
  KeyRound = KeyRound;
  XCircle = XCircle;
  TrendingUp = TrendingUp;
  Upload = Upload;
  RotateCcw = RotateCcw;
  MapPin = MapPin;
  Save = Save;


  // =====================================================
  // VARIABLES
  // =====================================================

  searchText = '';

  filterType = '';

  filterStatus: any = '';


  // =====================================================
  // STOCKIST LIST
  // =====================================================

  stockists: any[] = [];


  // =====================================================
  // AREA LIST
  // =====================================================

  areas: any[] = [];

  isLoadingAreas = false;


  // =====================================================
  // DASHBOARD SUMMARY
  // =====================================================

  totalStockists = 0;

  activeStockists = 0;

  inactivestockist = 0;

  newstockist = 0;

isUpdating: boolean = false;
  // =====================================================
  // PAGINATION
  // =====================================================

  pageNumber = 1;

  pageSize = 10;

  totalPages = 0;


  // =====================================================
  // EDIT MODAL
  // =====================================================

  showEditModal = false;

  selectedStockistId: any;

  stockistForm!: FormGroup;

  submitted = false;


  // =====================================================
  // LOGIN / USER
  // =====================================================

  agencyId =
    localStorage.getItem('aid');

  updatedBy: any;


  // =====================================================
  // FILE UPLOAD
  // =====================================================

  selectedImageFile: File | null = null;

  imagePreviewUrl:
    string | ArrayBuffer | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private stockistService: StockistService,

    private areaManagerService: AreaManagerService,

    private fb: FormBuilder
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.decodeToken();

    this.initializeForm();

    // Load areas for edit dropdown
    this.loadAreas();

    // Load stockist list
    this.getStockists();

    // Dashboard summary
    this.loadStockistDashboardSummary();
  }


  // =====================================================
  // FORM
  // =====================================================

  initializeForm(): void {

    this.stockistForm =
      this.fb.group({

        name: [
          '',
          Validators.required
        ],

        firmType: [
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

        gstNo: [''],

        drugLicenseNo: [''],

        region: [''],

        // =================================================
        // NEW AREA FIELD
        // =================================================

        areaId: [
          '',
          Validators.required
        ],

        isActive: [true]
      });
  }


  // =====================================================
  // TOKEN
  // =====================================================

  decodeToken(): void {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return;
    }

    try {

      const decoded: any =
        jwtDecode(token);

      this.updatedBy =
        decoded?.userId ||
        decoded?.UserId ||
        decoded?.id ||
        0;

    } catch (error) {

      console.error(
        'Token decode error:',
        error
      );

      this.updatedBy = 0;
    }
  }


  // =====================================================
  // LOAD AREAS
  // =====================================================

  loadAreas(): void {

    const agencyId =
      Number(localStorage.getItem('aid')) || 0;


    // -----------------------------------------
    // Validate Agency
    // -----------------------------------------

    if (agencyId <= 0) {

      console.error(
        'Invalid Agency ID'
      );

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid agency ID',
        confirmButtonColor: '#dc2626'
      });

      return;
    }


    this.isLoadingAreas = true;


    // -----------------------------------------
    // Get Active Areas
    // -----------------------------------------

    this.areaManagerService
      .get_all_area({
        agencyId: agencyId,
        isActive: true
      })
      .subscribe({

        // =====================================
        // SUCCESS
        // =====================================

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


        // =====================================
        // ERROR
        // =====================================

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
            text: 'Failed to load areas',
            confirmButtonColor: '#dc2626'
          });
        }

      });
  }


  // =====================================================
  // DASHBOARD SUMMARY
  // =====================================================

  loadStockistDashboardSummary(): void {

    this.stockistService
      .getstockistdashboarddetails(
        this.agencyId
      )
      .subscribe({

        next: (res: any) => {

          this.totalStockists =
            res?.data?.totalStockists || 0;

          this.activeStockists =
            res?.data?.activeStockists || 0;

          this.inactivestockist =
            res?.data?.inactiveStockists || 0;

          this.newstockist =
            res?.data?.newStockistsThisMonth || 0;
        },

        error: (err: any) => {

          console.error(
            'Dashboard summary error:',
            err
          );
        }

      });
  }


  // =====================================================
  // GET STOCKISTS
  // =====================================================

  getStockists(): void {

    const params = {

      AgencyId:
        this.agencyId,

      Search:
        this.searchText,

      FirmType:
        this.filterType,

      IsActive:
        this.filterStatus,

      PageNumber:
        this.pageNumber,

      PageSize:
        this.pageSize
    };


    this.stockistService
      .getstockistdetails(params)
      .subscribe({

        next: (res: any) => {

          this.stockists =
            res?.data?.data || [];


          this.totalStockists =
            res?.data?.totalRecords || 0;


          this.totalPages =
            Math.ceil(
              this.totalStockists /
              this.pageSize
            ) || 1;
        },

        error: (err: any) => {

          console.error(
            'Stockist list error:',
            err
          );

          this.stockists = [];

          this.totalPages = 1;
        }

      });
  }


  // =====================================================
  // FILTER
  // =====================================================

  applyFilter(): void {

    this.pageNumber = 1;

    this.getStockists();
  }


  // =====================================================
  // NEXT PAGE
  // =====================================================

  nextPage(): void {

    if (
      this.pageNumber <
      this.totalPages
    ) {

      this.pageNumber++;

      this.getStockists();
    }
  }


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {

    if (
      this.pageNumber > 1
    ) {

      this.pageNumber--;

      this.getStockists();
    }
  }


  // =====================================================
  // FILE CHANGE
  // =====================================================

  onFileChange(event: any): void {

    const file =
      event?.target?.files?.[0];

    if (!file) {
      return;
    }


    this.selectedImageFile = file;


    const reader =
      new FileReader();


    reader.onload = () => {

      this.imagePreviewUrl =
        reader.result;
    };


    reader.readAsDataURL(file);
  }


  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  removeImage(): void {

    this.selectedImageFile = null;

    this.imagePreviewUrl = null;
  }


  // =====================================================
  // EDIT STOCKIST
  // =====================================================

  editStockist(stockist: any): void {

    this.selectedStockistId =
      stockist.stockistId;


    this.showEditModal = true;


    this.submitted = false;


    // -----------------------------------------
    // Reset file
    // -----------------------------------------

    this.selectedImageFile = null;


    this.imagePreviewUrl =
      stockist.drugLicenseImage ||
      stockist.imageUrl ||
      stockist.drugLicensePhoto ||
      null;


    // -----------------------------------------
    // Patch stockist data
    // -----------------------------------------

    this.stockistForm.patchValue({

      name:
        stockist.name,

      firmType:
        stockist.firmType,

      contactPerson:
        stockist.contactPerson,

      mobile:
        stockist.mobile,

      email:
        stockist.email,

      address:
        stockist.address,

      city:
        stockist.city,

      state:
        stockist.state,

      pincode:
        stockist.pincode,

      gstNo:
        stockist.gstNo,

      drugLicenseNo:
        stockist.drugLicenseNo,

      region:
        stockist.region,

      // =====================================
      // IMPORTANT
      // Existing areaId selected
      // =====================================

      areaId:
        stockist.areaId,

      isActive:
        stockist.isActive
    });


    console.log(
      'Editing Stockist:',
      stockist
    );

    console.log(
      'Selected Area ID:',
      stockist.areaId
    );
  }


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeModal(): void {

    this.showEditModal = false;

    this.stockistForm.reset({
      isActive: true
    });

    this.submitted = false;

    this.selectedImageFile = null;

    this.imagePreviewUrl = null;
  }


  // =====================================================
  // UPDATE STOCKIST
  // =====================================================

updateStockist(): void {

  console.log('UPDATE BUTTON CLICKED');

  // Start loader immediately
  this.isUpdating = true;

  this.submitted = true;

  // -----------------------------------------
  // Validation
  // -----------------------------------------

  if (this.stockistForm.invalid) {

    console.log(
      'FORM INVALID',
      this.stockistForm.value
    );

    this.stockistForm.markAllAsTouched();

    this.isUpdating = false;

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all required fields correctly.',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }


  // -----------------------------------------
  // Area ID
  // -----------------------------------------

  const selectedAreaId =
    Number(this.stockistForm.value.areaId);

  console.log(
    'Selected Area ID:',
    selectedAreaId
  );


  if (!selectedAreaId || selectedAreaId <= 0) {

    this.isUpdating = false;

    Swal.fire({
      icon: 'warning',
      title: 'Area Required',
      text: 'Please select an area.',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }


  // -----------------------------------------
  // Payload
  // -----------------------------------------

  const payload = {

    stockistId:
      this.selectedStockistId,

    agencyId:
      Number(this.agencyId),

    name:
      this.stockistForm.value.name,

    firmType:
      this.stockistForm.value.firmType,

    contactPerson:
      this.stockistForm.value.contactPerson,

    mobile:
      this.stockistForm.value.mobile,

    email:
      this.stockistForm.value.email,

    address:
      this.stockistForm.value.address,

    city:
      this.stockistForm.value.city,

    state:
      this.stockistForm.value.state,

    pincode:
      this.stockistForm.value.pincode,

    gstNo:
      this.stockistForm.value.gstNo,

    drugLicenseNo:
      this.stockistForm.value.drugLicenseNo,

    region:
      this.stockistForm.value.region,

    areaId:
      selectedAreaId,

    isActive:
      this.stockistForm.value.isActive,

    updatedBy:
      this.updatedBy,

    drugLicenseImage:
      this.imagePreviewUrl
        ? String(this.imagePreviewUrl)
        : ''
  };


  console.log(
    'UPDATE PAYLOAD:',
    payload
  );


  // -----------------------------------------
  // API CALL
  // -----------------------------------------

  this.stockistService
    .updatestockistdetails(payload)
    .subscribe({

      next: (res: any) => {

        console.log(
          'UPDATE SUCCESS:',
          res
        );

        // Stop loader
        this.isUpdating = false;

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text:
            res?.message ||
            'Stockist Updated Successfully',
          confirmButtonColor: '#16a34a'
        }).then(() => {

          this.closeModal();

          this.getStockists();

          this.loadStockistDashboardSummary();

        });

      },

      error: (err: any) => {

        console.error(
          'UPDATE ERROR:',
          err
        );

        // Stop loader
        this.isUpdating = false;

        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text:
            err?.error?.message ||
            'Something went wrong',
          confirmButtonColor: '#dc2626'
        });

      }

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

      if (!result.isConfirmed) {
        return;
      }


      const payload = {

        userId:
          data.userId,

        updatedBy:
          this.updatedBy
      };


      this.stockistService
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

    });
  }


  // =====================================================
  // DELETE / DEACTIVATE
  // =====================================================

  deleteStockist(stockist: any): void {

    Swal.fire({

      title: 'Delete Stockist?',

      text:
        `Are you sure you want to delete ${stockist.name}?`,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, Delete',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#dc2626',

      cancelButtonColor: '#6b7280'

    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }


      const payload = {

        stockistId:
          stockist.stockistId,

        agencyId:
          Number(this.agencyId),

        name:
          stockist.name,

        firmType:
          stockist.firmType,

        contactPerson:
          stockist.contactPerson,

        mobile:
          stockist.mobile,

        email:
          stockist.email,

        address:
          stockist.address,

        city:
          stockist.city,

        state:
          stockist.state,

        pincode:
          stockist.pincode,

        gstNo:
          stockist.gstNo,

        drugLicenseNo:
          stockist.drugLicenseNo,

        region:
          stockist.region,

        // =====================================
        // Keep existing area
        // =====================================

        areaId:
          stockist.areaId
            ? Number(stockist.areaId)
            : null,

        isActive: false,

        updatedBy:
          this.updatedBy
      };


      Swal.fire({

        title: 'Deleting Stockist...',

        text: 'Please wait',

        allowOutsideClick: false,

        allowEscapeKey: false,

        didOpen: () => {

          Swal.showLoading();
        }

      });


      this.stockistService
        .updatestockistdetails(payload)
        .subscribe({

          next: (res: any) => {

            Swal.fire({

              icon: 'success',

              title: 'Deleted',

              text:
                res?.message ||
                'Stockist Deleted Successfully',

              confirmButtonColor: '#16a34a'
            });


            this.getStockists();

            this.loadStockistDashboardSummary();
          },

          error: (err: any) => {

            console.error(
              'Delete Stockist Error:',
              err
            );


            Swal.fire({

              icon: 'error',

              title: 'Delete Failed',

              text:
                err?.error?.message ||
                'Something went wrong',

              confirmButtonColor: '#dc2626'
            });
          }

        });

    });
  }


  // =====================================================
  // FORM CONTROLS
  // =====================================================

  get f() {

    return this.stockistForm.controls;
  }


  // =====================================================
  // RESET FILTERS
  // =====================================================

  resetFilters(): void {

    this.searchText = '';

    this.filterType = '';

    this.filterStatus = '';

    this.pageNumber = 1;

    this.getStockists();
  }

}

