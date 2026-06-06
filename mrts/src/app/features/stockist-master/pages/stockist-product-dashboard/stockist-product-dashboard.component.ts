import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import {
  Package,
  Plus,
  Upload,
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-angular';

import Swal from 'sweetalert2';
import { StockistService } from '../../services/stockist.service';



@Component({
  selector: 'app-stockist-product-dashboard',
  templateUrl: './stockist-product-dashboard.component.html',
  styleUrl: './stockist-product-dashboard.component.css'
})
export class StockistProductDashboardComponent implements OnInit {

  Package = Package;
  Plus = Plus;
  Upload = Upload;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  TrendingUp = TrendingUp;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;
  X = X;

  filterForm!: FormGroup;
  editForm!: FormGroup;

  products: any[] = [];

  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  isLoading = false;

  selectedProduct: any = null;

  showViewModal = false;
  showEditModal = false;

  selectedInventoryId = 0;

  constructor(
    private fb: FormBuilder,
    private stockistService: StockistService
  ) { }

  ngOnInit(): void {

    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      minPrice: [null],
      maxPrice: [null]
    });

    this.editForm = this.fb.group({
      quantity: [0],
      sellingPrice: [0],
      discountPercent: [0],
      isAvailable: [true]
    });

    this.getProducts();
  }

  getProducts(): void {

    this.isLoading = true;

    const payload = {
      agencyId: Number(localStorage.getItem('aid')),
      stockistId: Number(localStorage.getItem('mid')),
      search: this.filterForm.value.search || null,
      category: this.filterForm.value.category || null,
      minPrice: this.filterForm.value.minPrice || null,
      maxPrice: this.filterForm.value.maxPrice || null,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.stockistService
      .get_stockist_inventory_list(payload)
      .subscribe({
        next: (res: any) => {

          this.products = res.data || [];

          this.pageNumber = res.pageNumber;
          this.pageSize = res.pageSize;
          this.totalRecords = res.totalRecords;

          this.totalPages = Math.ceil(
            this.totalRecords / this.pageSize
          );

          this.isLoading = false;
        },
        error: (err) => {

          this.isLoading = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'Failed to load products'
          });
        }
      });
  }

  applyFilters(): void {

    this.pageNumber = 1;
    this.getProducts();
  }

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

  previousPage(): void {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.getProducts();
    }
  }

  nextPage(): void {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.getProducts();
    }
  }

  openViewModal(product: any): void {

    this.selectedProduct = product;

    this.showViewModal = true;
  }

  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedProduct = null;
  }

  openEditModal(product: any): void {

    this.selectedInventoryId = product.inventoryId;

    this.editForm.patchValue({
      quantity: product.quantity,
      sellingPrice: product.sellingPrice,
      discountPercent: product.discountPercent,
      isAvailable: product.isAvailable
    });

    this.showEditModal = true;
  }

  closeEditModal(): void {

    this.showEditModal = false;

    this.selectedInventoryId = 0;
  }

  updateProduct(): void {

    const payload = {
      id: this.selectedInventoryId,
      quantity: this.editForm.value.quantity,
      sellingPrice: this.editForm.value.sellingPrice,
      discountPercent: this.editForm.value.discountPercent,
      isAvailable: this.editForm.value.isAvailable
    };

    this.stockistService
      .update_stockist_product(payload)
      .subscribe({
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product updated successfully'
          });

          this.closeEditModal();

          this.getProducts();
        },
        error: (err) => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'Update failed'
          });
        }
      });
  }

  get activeProducts(): number {
    return this.products.filter(x => x.isAvailable).length;
  }

  get unavailableProducts(): number {
    return this.products.filter(x => !x.isAvailable).length;
  }
}
