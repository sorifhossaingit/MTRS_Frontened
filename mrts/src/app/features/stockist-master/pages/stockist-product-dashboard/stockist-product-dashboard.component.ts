import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  LucideAngularModule,
  Package,
  Plus,
  Upload,
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Box,
  Layers,
  Tag,
  XIcon
} from 'lucide-angular';

import Swal from 'sweetalert2';
import { StockistService } from '../../services/stockist.service';


@Component({
  selector: 'app-stockist-product-dashboard',
  templateUrl: './stockist-product-dashboard.component.html',
  styleUrl: './stockist-product-dashboard.component.css'
})
export class StockistProductDashboardComponent implements OnInit {

  // =====================================================
  // ICONS
  // =====================================================

  readonly PackageIcon = Package;
  readonly PlusIcon = Plus;
  readonly UploadIcon = Upload;
  readonly CheckCircleIcon = CheckCircle;
  readonly XCircleIcon = XCircle;
  readonly TrendingUpIcon = TrendingUp;
  readonly EyeIcon = Eye;
  readonly PencilIcon = Pencil;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly XIcon = X;
  readonly SearchIcon = Search;
  readonly RotateCcwIcon = RotateCcw;
  readonly SlidersIcon = SlidersHorizontal;
  readonly BoxIcon = Box;
  readonly LayersIcon = Layers;
  readonly TagIcon = Tag;

  // =====================================================
  // FORMS
  // =====================================================

  filterForm!: FormGroup;
  editForm!: FormGroup;

  // =====================================================
  // DATA
  // =====================================================

  products: any[] = [];

  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  // =====================================================
  // LOADING
  // =====================================================

  isLoading = false;
  isUpdating = false;

  // =====================================================
  // MODALS
  // =====================================================

  selectedProduct: any = null;

  showViewModal = false;
  showEditModal = false;

  selectedInventoryId = 0;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private fb: FormBuilder,
    private stockistService: StockistService
  ) { }


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    // ==========================
    // FILTER FORM
    // ==========================

    this.filterForm = this.fb.group({

      search: [''],

      category: [''],

      minPrice: [
        null,
        [
          Validators.min(0)
        ]
      ],

      maxPrice: [
        null,
        [
          Validators.min(0)
        ]
      ]

    });


    // ==========================
    // EDIT FORM
    // ==========================

    this.editForm = this.fb.group({

      quantity: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      sellingPrice: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      taxPercent: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      ],

      discountPercent: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      ],

      isAvailable: [
        true
      ]

    });


    this.getProducts();

  }


  // =====================================================
  // GET PRODUCTS
  // =====================================================

  getProducts(): void {

    this.isLoading = true;

    const payload = {

      agencyId:
        Number(localStorage.getItem('aid')),

      stockistId:
        Number(localStorage.getItem('mid')),

      search:
        this.filterForm.value.search || null,

      category:
        this.filterForm.value.category || null,

      minPrice:
        this.filterForm.value.minPrice ?? null,

      maxPrice:
        this.filterForm.value.maxPrice ?? null,

      pageNumber:
        this.pageNumber,

      pageSize:
        this.pageSize

    };


    this.stockistService
      .get_stockist_inventory_list(payload)
      .subscribe({

        next: (res: any) => {

          this.products =
            res?.data || [];

          this.pageNumber =
            res?.pageNumber || 1;

          this.pageSize =
            res?.pageSize || 10;

          this.totalRecords =
            res?.totalRecords || 0;

          this.totalPages =
            Math.ceil(
              this.totalRecords /
              this.pageSize
            );

          this.isLoading = false;

        },

        error: (err: any) => {

          this.isLoading = false;

          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.message ||
              'Failed to load products'
          });

        }

      });

  }


  // =====================================================
  // APPLY FILTERS
  // =====================================================

  applyFilters(): void {

    this.pageNumber = 1;

    this.getProducts();

  }


  // =====================================================
  // RESET FILTERS
  // =====================================================

  resetFilters(): void {

    this.filterForm.reset({

      search: '',

      category: '',

      minPrice: null,

      maxPrice: null

    });

    this.pageNumber = 1;

    this.getProducts();

  }


  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.getProducts();

    }

  }


  // =====================================================
  // NEXT PAGE
  // =====================================================

  nextPage(): void {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.getProducts();

    }

  }


  // =====================================================
  // VIEW MODAL
  // =====================================================

  openViewModal(product: any): void {

    this.selectedProduct = product;

    this.showViewModal = true;

  }


  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedProduct = null;

  }


  // =====================================================
  // EDIT MODAL
  // =====================================================

  openEditModal(product: any): void {

    this.selectedInventoryId =
      product.inventoryId;

    this.editForm.patchValue({

      // Quantity means
      // additional quantity to add
      quantity: 0,

      sellingPrice:
        product.sellingPrice ?? 0,

      taxPercent:
        product.taxPercent ?? 0,

      discountPercent:
        product.discountPercent ?? 0,

      isAvailable:
        product.isAvailable ?? true

    });

    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();

    this.showEditModal = true;

  }


  closeEditModal(): void {

    // Don't allow closing while API
    // request is running
    if (this.isUpdating) {
      return;
    }

    this.showEditModal = false;

    this.selectedInventoryId = 0;

    this.editForm.reset({

      quantity: 0,

      sellingPrice: 0,

      taxPercent: 0,

      discountPercent: 0,

      isAvailable: true

    });

  }


  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  updateProduct(): void {

    // Prevent duplicate API calls
    if (this.isUpdating) {
      return;
    }


    // ==========================
    // VALIDATION
    // ==========================

    if (this.editForm.invalid) {

      this.editForm.markAllAsTouched();

      Swal.fire({

        icon: 'warning',

        title: 'Validation Error',

        text:
          'Please enter valid values. Negative values are not allowed.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }


    // ==========================
    // EXTRA SAFETY CHECK
    // ==========================

    const quantity =
      Number(this.editForm.value.quantity);

    const sellingPrice =
      Number(this.editForm.value.sellingPrice);

    const taxPercent =
      Number(this.editForm.value.taxPercent);

    const discountPercent =
      Number(this.editForm.value.discountPercent);


    if (
      quantity < 0 ||
      sellingPrice < 0 ||
      taxPercent < 0 ||
      discountPercent < 0
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Invalid Value',

        text:
          'Negative values are not allowed.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }


    // Tax cannot exceed 100
    if (taxPercent > 100) {

      Swal.fire({

        icon: 'warning',

        title: 'Invalid Tax',

        text:
          'Tax cannot be more than 100%.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }


    // Discount cannot exceed 100
    if (discountPercent > 100) {

      Swal.fire({

        icon: 'warning',

        title: 'Invalid Discount',

        text:
          'Discount cannot be more than 100%.',

        confirmButtonColor: '#f59e0b'

      });

      return;

    }


    // ==========================
    // START LOADING
    // ==========================

    this.isUpdating = true;


    // ==========================
    // PAYLOAD
    // ==========================

    const payload = {

      id:
        this.selectedInventoryId,

      quantity:
        quantity,

      sellingPrice:
        sellingPrice,

      taxPercent:
        taxPercent,

      discountPercent:
        discountPercent,

      isAvailable:
        this.editForm.value.isAvailable

    };


    // ==========================
    // API CALL
    // ==========================

    this.stockistService
      .update_stockist_product(payload)
      .subscribe({

        // ==========================
        // SUCCESS
        // ==========================

        next: (res: any) => {

          this.isUpdating = false;

          Swal.fire({

            icon: 'success',

            title: 'Success',

            text:
              res?.message ||
              'Product updated successfully',

            confirmButtonColor:
              '#16a34a'

          }).then(() => {

            this.closeEditModal();

            this.getProducts();

          });

        },


        // ==========================
        // ERROR
        // ==========================

        error: (err: any) => {

          this.isUpdating = false;

          console.error(err);

          Swal.fire({

            icon: 'error',

            title: 'Error',

            text:
              err?.error?.message ||
              'Update failed',

            confirmButtonColor:
              '#dc2626'

          });

        }

      });

  }


  // =====================================================
  // ACTIVE PRODUCTS
  // =====================================================

  get activeProducts(): number {

    return this.products
      .filter(x => x.isAvailable)
      .length;

  }


  // =====================================================
  // UNAVAILABLE PRODUCTS
  // =====================================================

  get unavailableProducts(): number {

    return this.products
      .filter(x => !x.isAvailable)
      .length;

  }

}