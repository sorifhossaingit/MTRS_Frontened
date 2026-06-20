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
  TrendingUp
} from 'lucide-angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { jwtDecode } from 'jwt-decode';
import { StockistService } from '../../services/stockist.service';
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
  // =====================================================
  // VARIABLES
  // =====================================================

  searchText = '';

  filterType = '';

  filterStatus: any = '';

  stockists: any[] = [];

  areaManagerList: any[] = [];

  totalStockists = 0;

  activeStockists = 0;

  inactivestockist = 0;

  newstockist = 0;

  pageNumber = 1;

  pageSize = 10;

  totalPages = 0;

  showEditModal = false;

  selectedStockistId: any;

  stockistForm!: FormGroup;

  submitted = false;

  agencyId =
    localStorage.getItem('aid');

  updatedBy: any;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private stockistService: StockistService,
    private fb: FormBuilder
  ) { }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.decodeToken();

    this.initializeForm();

    this.getAreaManagers();

    this.getStockists();

    this.loadStockistDashboardSummary();

  }

  // =====================================================
  // FORM
  // =====================================================

  initializeForm() {

    this.stockistForm = this.fb.group({

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

      region: [''],

      assignedAreaManager: [
        '',
        Validators.required
      ],

      coverArea: [''],

      isActive: [true]

    });

  }

  // =====================================================
  // TOKEN
  // =====================================================

  decodeToken() {

    const token =
      localStorage.getItem('token');

    if (token) {

      const decoded: any =
        jwtDecode(token);

      this.updatedBy =
        decoded?.userId ||
        decoded?.UserId ||
        decoded?.id;

    }

  }

  // =====================================================
  // GET AREA MANAGER LIST
  // =====================================================

  getAreaManagers() {

    this.stockistService
      .getAreamanagerlist(this.agencyId)
      .subscribe({

        next: (res: any) => {

          this.areaManagerList =
            res?.data || res || [];

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

loadStockistDashboardSummary() {

    this.stockistService
      .getstockistdashboarddetails(this.agencyId)
      .subscribe({

        next: (res: any) => {

          this.totalStockists =
            res.data.totalStockists || 0;

          this.activeStockists =
            res.data.activeStockists || 0;

          this.inactivestockist =
            res.data.inactiveStockists || 0;

          this.newstockist =
            res.data.newStockistsThisMonth || 0;

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }


  // =====================================================
  // GET STOCKISTS
  // =====================================================

  getStockists() {

    const params = {

      AgencyId: this.agencyId,

      Search: this.searchText,

      FirmType: this.filterType,

      IsActive: this.filterStatus,

      PageNumber: this.pageNumber,

      PageSize: this.pageSize

    };

    this.stockistService
      .getstockistdetails(params)
      .subscribe({

        next: (res: any) => {

          this.stockists =
            res?.data?.data || [];

          this.totalPages = Math.ceil(
            this.totalStockists /
            this.pageSize
          );

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =====================================================
  // FILTER
  // =====================================================

  applyFilter() {

    this.pageNumber = 1;

    this.getStockists();

  }

  // =====================================================
  // PAGINATION
  // =====================================================

  nextPage() {

    if (
      this.pageNumber < this.totalPages
    ) {

      this.pageNumber++;

      this.getStockists();

    }

  }

  previousPage() {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.getStockists();

    }

  }

  // =====================================================
  // EDIT
  // =====================================================

  editStockist(stockist: any) {

    this.selectedStockistId =
      stockist.stockistId;

    this.showEditModal = true;

    this.stockistForm.patchValue({

      name: stockist.name,

      firmType: stockist.firmType,

      contactPerson:
        stockist.contactPerson,

      mobile: stockist.mobile,

      email: stockist.email,

      address: stockist.address,

      city: stockist.city,

      state: stockist.state,

      pincode: stockist.pincode,

      gstNo: stockist.gstNo,

      drugLicenseNo:
        stockist.drugLicenseNo,

      region: stockist.region,

      assignedAreaManager:
        stockist.assignedAreaManager,

      coverArea:
        stockist.coverArea,

      isActive:
        stockist.isActive

    });

  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeModal() {

    this.showEditModal = false;

    this.stockistForm.reset();

    this.submitted = false;

  }

  // =====================================================
  // UPDATE STOCKIST
  // =====================================================

  updateStockist() {

    this.submitted = true;

    if (this.stockistForm.invalid) {

      this.stockistForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
        confirmButtonColor: '#f59e0b'
      });

      return;

    }

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

      assignedAreaManager:
        Number(
          this.stockistForm.value.assignedAreaManager
        ),

      coverArea:
        this.stockistForm.value.coverArea,

      isActive:
        this.stockistForm.value.isActive,

      updatedBy:
        this.updatedBy

    };

    this.stockistService
      .updatestockistdetails(payload)
      .subscribe({

        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Stockist Updated Successfully',
            confirmButtonColor: '#16a34a'
          });

          this.closeModal();

          this.getStockists();
          this.loadStockistDashboardSummary();

        },

        error: (err: any) => {

          console.log(err);

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

  reset_password(data: any): void {
    Swal.fire({
      title: 'Reset Password?',
      text: `Are you sure you want to reset the password for ${data.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Reset',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb'
    }).then((result) => {

      if (result.isConfirmed) {

        const payload = {
          userId: data.userId, // change if your API expects another field
          updatedBy: this.updatedBy
        };

        this.stockistService.reset_password(payload).subscribe({
          next: (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: res?.message || 'Password reset successfully.'
            });
          },
          error: (err) => {
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

  deleteStockist(stockist: any) {

    Swal.fire({
      title: 'Delete Stockist?',
      text: `Are you sure you want to delete ${stockist.name}?`,
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

        stockistId: stockist.stockistId,

        agencyId: Number(this.agencyId),

        name: stockist.name,

        firmType: stockist.firmType,

        contactPerson: stockist.contactPerson,

        mobile: stockist.mobile,

        email: stockist.email,

        address: stockist.address,

        city: stockist.city,

        state: stockist.state,

        pincode: stockist.pincode,

        gstNo: stockist.gstNo,

        drugLicenseNo: stockist.drugLicenseNo,

        region: stockist.region,

        assignedAreaManager:
          Number(stockist.assignedAreaManager),

        coverArea: stockist.coverArea,

        isActive: false,

        updatedBy: this.updatedBy

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
              text: 'Stockist Deleted Successfully',
              confirmButtonColor: '#16a34a'
            });

            this.getStockists();
            this.loadStockistDashboardSummary();
          },

          error: (err: any) => {

            console.log(err);

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

}
