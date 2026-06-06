import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Package, ShoppingCart, Trash2, ChevronLeft, ChevronRight } from 'lucide-angular';
import Swal from 'sweetalert2';
import { StockistService } from '../../services/stockist.service';



@Component({
  selector: 'app-medicine-order-master',
  templateUrl: './medicine-order-master.component.html',
  styleUrl: './medicine-order-master.component.css'
})
export class MedicineOrderMasterComponent implements OnInit {

  Package = Package;
  ShoppingCart = ShoppingCart;
  Trash2 = Trash2;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  filterForm!: FormGroup;

  products: any[] = [];
  cartItems: any[] = [];

  remarks = '';

  isLoading = false;

  pageNumber = 1;
  pageSize = 12;
  totalRecords = 0;
  totalPages = 0;

  constructor(
    private fb: FormBuilder,
    private stockistService: StockistService
  ) {}

  ngOnInit(): void {

    this.filterForm = this.fb.group({
      name: [''],
      brandName: [''],
      category: ['']
    });

    this.getProducts();
  }

  getProducts(): void {

    this.isLoading = true;

    const params = {
      agencyId: Number(localStorage.getItem('aid')),
      name: this.filterForm.value.name || '',
      brandName: this.filterForm.value.brandName || '',
      category: this.filterForm.value.category || '',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.stockistService
      .get_available_Product_for_order(params)
      .subscribe({
        next: (res: any) => {

          this.products = (res.data || []).map((item: any) => ({
            ...item,
            orderQty: 1
          }));

          this.pageNumber = res.pageNumber;
          this.pageSize = res.pageSize;
          this.totalRecords = res.totalCount || 0;

          this.totalPages = Math.ceil(
            this.totalRecords / this.pageSize
          );

          this.isLoading = false;
        },
        error: (err: any) => {

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
      name: '',
      brandName: '',
      category: ''
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

  addToCart(product: any): void {

    const qty = Number(product.orderQty);

    if (!qty || qty <= 0) {

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        text: 'Please enter quantity'
      });

      return;
    }

    const existing = this.cartItems.find(
      x => x.productId === product.productId
    );

    if (existing) {

      existing.quantity += qty;

    } else {

      this.cartItems.push({
        productId: product.productId,
        productName: product.name,

        quantity: qty,

        freeQuantity: 0,

        mrp: product.mrp,
        ptr: product.ptr,
        pts: product.pts,

        discountPercent: 0,
        taxPercent: 0,

        batchNumber: '',
        expiryDate: null,

        imageUrl: product.imageUrl,

        remarks: product.name
      });
    }

    product.orderQty = 1;

    Swal.fire({
      icon: 'success',
      title: 'Added To Cart',
      timer: 1000,
      showConfirmButton: false
    });
  }

  removeFromCart(item: any): void {

    this.cartItems = this.cartItems.filter(
      x => x.productId !== item.productId
    );
  }

  clearCart(): void {

    this.cartItems = [];
  }

  get totalItems(): number {

    return this.cartItems.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    );
  }

  get totalAmount(): number {

    return this.cartItems.reduce(
      (sum, item) =>
        sum + (item.quantity * item.ptr),
      0
    );
  }

  placeOrder(): void {

    if (this.cartItems.length === 0) {

      Swal.fire({
        icon: 'warning',
        title: 'Cart Empty',
        text: 'Please add products first'
      });

      return;
    }

    const payload = {

      agencyId: Number(localStorage.getItem('aid')),

      stockistId: Number(localStorage.getItem('mid')),

      createdBy: Number(localStorage.getItem('mid')),

      orderDate: new Date().toISOString(),

      totalAmount: this.totalAmount,

      remarks: this.remarks,

      products: this.cartItems.map(item => ({

        productId: item.productId,

        quantity: item.quantity,

        freeQuantity: item.freeQuantity,

        mrp: item.mrp,

        ptr: item.ptr,

        pts: item.pts,

        discountPercent: item.discountPercent,

        taxPercent: item.taxPercent,

        totalAmount: item.quantity * item.ptr,

        batchNumber: item.batchNumber,

        expiryDate: item.expiryDate,

        remarks: item.remarks
      }))
    };

    this.stockistService
      .stockist_create_order(payload)
      .subscribe({
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Order Created Successfully'
          });

          this.cartItems = [];
          this.remarks = '';

          this.getProducts();
        },
        error: (err: any) => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'Order Failed'
          });
        }
      });
  }
}
