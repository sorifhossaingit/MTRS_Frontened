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
  X
} from 'lucide-angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { jwtDecode } from 'jwt-decode';
import { StockistService } from '../../services/stockist.service';

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

  // =====================================================
  // VARIABLES
  // =====================================================

  searchText = '';
  filterType = '';
  filterStatus = '';

  stockists: any[] = [];

  totalStockists = 0;
  activeStockists = 0;
  totalOutstanding = 0;
  totalCreditLimit = 0;

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
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.decodeToken();

    this.initializeForm();

    this.getStockists();

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
        Validators.required
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

      assignedAreaManager: [0],

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
  // GET STOCKISTS
  // =====================================================

  getStockists() {

    const params = {

      agencyId: this.agencyId,

      search: this.searchText,

      firmType: this.filterType,

      isActive: this.filterStatus,

      pageNumber: this.pageNumber,

      pageSize: this.pageSize

    };

    this.stockistService
      .getstockistdetails(params)
      .subscribe({

        next: (res: any) => {

          this.stockists =
            res?.data || [];

          // SUMMARY

          this.totalStockists =
            this.stockists.length;

          this.activeStockists =
            this.stockists.filter(
              (s: any) => s.isActive
            ).length;

          this.totalOutstanding =
            this.stockists.reduce(
              (sum: number, s: any) =>
                sum + (s.outstanding || 0),
              0
            );

          this.totalCreditLimit =
            this.stockists.reduce(
              (sum: number, s: any) =>
                sum + (s.creditLimit || 0),
              0
            );

          // PAGINATION

          this.totalPages =
            res?.totalPages || 0;

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

      contactPerson: stockist.contactPerson,

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

      coverArea: stockist.coverArea,

      isActive: stockist.isActive

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

      return;

    }

    const payload = {

      stockistId:
        this.selectedStockistId,

      agencyId: this.agencyId,

      updatedBy: this.updatedBy,

      ...this.stockistForm.value

    };

    this.stockistService
      .updatestockistdetails(payload)
      .subscribe({

        next: (res: any) => {

          alert(
            'Stockist Updated Successfully'
          );

          this.closeModal();

          this.getStockists();

        },

        error: (err: any) => {

          console.log(err);

          alert(
            'Something went wrong'
          );

        }

      });

  }

  // =====================================================
  // FORM CONTROLS
  // =====================================================

  get f() {

    return this.stockistForm.controls;

  }

}
