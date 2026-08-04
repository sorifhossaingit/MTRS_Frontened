// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { Package, ShoppingCart, Trash2, ChevronLeft, ChevronRight } from 'lucide-angular';
// import Swal from 'sweetalert2';
// import { StockistService } from '../../services/stockist.service';

// interface CartItem {
//   productId: number;
//   productName: string;
//   quantity: number;
//   freeQuantity: number;
//   mrp: number;
//   ptr: number;
//   pts: number;
//   discountPercent: number;
//   taxPercent: number;
//   batchNumber: string;
//   expiryDate: string | null;
//   imageUrl: string;
//   remarks: string;
// }

// interface Product {
//   productId: number;
//   name: string;
//   brandName: string;
//   category: string;
//   dosageForm: string;
//   strength: string;
//   packSize: string;
//   mrp: number;
//   ptr: number;
//   pts: number;
//   imageUrl: string;
//   orderQty: number;
// }

// @Component({
//   selector: 'app-medicine-order-master',
//   templateUrl: './medicine-order-master.component.html',
//   styleUrl: './medicine-order-master.component.css'
// })
// export class MedicineOrderMasterComponent implements OnInit {

//   // Icons
//   Package = Package;
//   ShoppingCart = ShoppingCart;
//   Trash2 = Trash2;
//   ChevronLeft = ChevronLeft;
//   ChevronRight = ChevronRight;

//   filterForm!: FormGroup;

//   products: Product[] = [];
//   cartItems: CartItem[] = [];

//   remarks = '';
//   isLoading = false;

//   // Pagination
//   pageNumber = 1;
//   pageSize = 12;
//   totalRecords = 0;
//   totalPages = 0;

//   constructor(
//     private fb: FormBuilder,
//     private stockistService: StockistService
//   ) {}

//   ngOnInit(): void {
//     this.initFilterForm();
//     this.getProducts();
//   }

//   private initFilterForm(): void {
//     this.filterForm = this.fb.group({
//       name: [''],
//       brandName: [''],
//       category: ['']
//     });
//   }

//   getProducts(): void {
//     this.isLoading = true;

//     const params = {
//       agencyId: Number(localStorage.getItem('aid')) || 0,
//       name: this.filterForm.value.name?.trim() || '',
//       brandName: this.filterForm.value.brandName?.trim() || '',
//       category: this.filterForm.value.category?.trim() || '',
//       pageNumber: this.pageNumber,
//       pageSize: this.pageSize
//     };

//     this.stockistService
//       .get_available_Product_for_order(params)
//       .subscribe({
//         next: (res: any) => {
//           this.products = (res.data || []).map((item: any) => ({
//             ...item,
//             orderQty: 1
//           }));

//           this.pageNumber = res.pageNumber || 1;
//           this.pageSize = res.pageSize || 12;
//           this.totalRecords = res.totalCount || 0;
//           this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 0;

//           this.isLoading = false;
//         },
//         error: (err: any) => {
//           this.isLoading = false;
//           Swal.fire({
//             icon: 'error',
//             title: 'Error Loading Products',
//             text: err?.error?.message || 'Failed to load medicine list.'
//           });
//         }
//       });
//   }

//   applyFilters(): void {
//     this.pageNumber = 1;
//     this.getProducts();
//   }

//   resetFilters(): void {
//     this.filterForm.reset({
//       name: '',
//       brandName: '',
//       category: ''
//     });

//     this.pageNumber = 1;
//     this.getProducts();
//   }

//   previousPage(): void {
//     if (this.pageNumber > 1) {
//       this.pageNumber--;
//       this.getProducts();
//     }
//   }

//   nextPage(): void {
//     if (this.pageNumber < this.totalPages) {
//       this.pageNumber++;
//       this.getProducts();
//     }
//   }

//   addToCart(product: Product): void {
//     const qty = Number(product.orderQty);

//     if (!qty || qty <= 0 || !Number.isInteger(qty)) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Invalid Quantity',
//         text: 'Please enter a valid positive quantity.'
//       });
//       return;
//     }

//     const existingItem = this.cartItems.find(x => x.productId === product.productId);

//     if (existingItem) {
//       existingItem.quantity += qty;
//     } else {
//       this.cartItems.push({
//         productId: product.productId,
//         productName: product.name,
//         quantity: qty,
//         freeQuantity: 0,
//         mrp: product.mrp || 0,
//         ptr: product.ptr || 0,
//         pts: product.pts || 0,
//         discountPercent: 0,
//         taxPercent: 0,
//         batchNumber: '',
//         expiryDate: null,
//         imageUrl: product.imageUrl,
//         remarks: product.name
//       });
//     }

//     product.orderQty = 1;

//     Swal.fire({
//       icon: 'success',
//       title: 'Added to Cart',
//       timer: 1000,
//       showConfirmButton: false,
//       toast: true,
//       position: 'top-end'
//     });
//   }

//   removeFromCart(item: CartItem): void {
//     this.cartItems = this.cartItems.filter(x => x.productId !== item.productId);
//   }

//   clearCart(): void {
//     this.cartItems = [];
//   }

//   get totalItems(): number {
//     return this.cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
//   }

//   get totalAmount(): number {
//     return this.cartItems.reduce((sum, item) => sum + (item.quantity * item.mrp), 0);
//   }

//   placeOrder(): void {
//     if (this.cartItems.length === 0) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Cart is Empty',
//         text: 'Please add products to your cart before placing an order.'
//       });
//       return;
//     }

//     const payload = {
//       agencyId: Number(localStorage.getItem('aid')),
//       stockistId: Number(localStorage.getItem('mid')),
//       createdBy: Number(localStorage.getItem('mid')),
//       orderDate: new Date().toISOString(),
//       totalAmount: this.totalAmount,
//       remarks: this.remarks,
//       products: this.cartItems.map(item => ({
//         productId: item.productId,
//         quantity: item.quantity,
//         freeQuantity: item.freeQuantity,
//         mrp: item.mrp,
//         ptr: item.ptr,
//         pts: item.pts,
//         discountPercent: item.discountPercent,
//         taxPercent: item.taxPercent,
//         totalAmount: item.quantity * item.mrp,
//         batchNumber: item.batchNumber,
//         expiryDate: item.expiryDate,
//         remarks: item.remarks
//       }))
//     };

//     this.stockistService.stockist_create_order(payload).subscribe({
//       next: () => {
//         Swal.fire({
//           icon: 'success',
//           title: 'Order Placed!',
//           text: 'Your order has been created successfully.'
//         });

//         this.cartItems = [];
//         this.remarks = '';
//         this.getProducts();
//       },
//       error: (err: any) => {
//         Swal.fire({
//           icon: 'error',
//           title: 'Order Failed',
//           text: err?.error?.message || 'Failed to submit the order. Please try again.'
//         });
//       }
//     });
//   }
// }



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Package, ShoppingCart, Trash2, ChevronLeft, ChevronRight } from 'lucide-angular';
import Swal from 'sweetalert2';
import { StockistService } from '../../services/stockist.service';

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  freeQuantity: number;
  mrp: number;
  ptr: number;
  pts: number;
  discountPercent: number;
  taxPercent: number;
  finalPrice: number;
  batchNumber: string;
  expiryDate: string | null;
  imageUrl: string;
  remarks: string;
}

interface Product {
  productId: number;
  name: string;
  brandName: string;
  category: string;
  dosageForm: string;
  strength: string;
  packSize: string;
  mrp: number;
  ptr: number;
  pts: number;
  discountPercent: number;
  taxPercent: number;
  finalPrice: number;
  imageUrl: string;
  orderQty: number;
}

@Component({
  selector: 'app-medicine-order-master',
  templateUrl: './medicine-order-master.component.html',
  styleUrl: './medicine-order-master.component.css'
})
export class MedicineOrderMasterComponent implements OnInit {

  // Icons
  Package = Package;
  ShoppingCart = ShoppingCart;
  Trash2 = Trash2;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  filterForm!: FormGroup;

  products: Product[] = [];
  cartItems: CartItem[] = [];

  remarks = '';
  isLoading = false;

  // Pagination
  pageNumber = 1;
  pageSize = 12;
  totalRecords = 0;
  totalPages = 0;

  constructor(
    private fb: FormBuilder,
    private stockistService: StockistService
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.getProducts();
  }

  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      name: [''],
      brandName: [''],
      category: ['']
    });
  }

  // Calculate Effective Price per unit: MRP - Discount + Tax
  calculateUnitPrice(mrp: number, discountPercent: number, taxPercent: number): number {
    const baseMrp = Number(mrp) || 0;
    const disc = Number(discountPercent) || 0;
    const tax = Number(taxPercent) || 0;

    const discountedPrice = baseMrp - (baseMrp * (disc / 100));
    const finalPrice = discountedPrice + (discountedPrice * (tax / 100));

    return finalPrice;
  }

  getProducts(): void {
    this.isLoading = true;

    const params = {
      agencyId: Number(localStorage.getItem('aid')) || 0,
      name: this.filterForm.value.name?.trim() || '',
      brandName: this.filterForm.value.brandName?.trim() || '',
      category: this.filterForm.value.category?.trim() || '',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.stockistService
      .get_available_Product_for_order(params)
      .subscribe({
        next: (res: any) => {
          this.products = (res.data || []).map((item: any) => {
            const mrp = Number(item.mrp) || 0;
            const discountPercent = Number(item.discountPercent) || 0;
            const taxPercent = Number(item.taxPercent) || 0;

            // Use backend finalPrice if provided, or fallback to client formula
            const computedFinalPrice = item.finalPrice 
              ? Number(item.finalPrice) 
              : this.calculateUnitPrice(mrp, discountPercent, taxPercent);

            return {
              ...item,
              mrp,
              discountPercent,
              taxPercent,
              finalPrice: computedFinalPrice,
              orderQty: 1
            };
          });

          this.pageNumber = res.pageNumber || 1;
          this.pageSize = res.pageSize || 12;
          this.totalRecords = res.totalCount || 0;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 0;

          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error Loading Products',
            text: err?.error?.message || 'Failed to load medicine list.'
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

  addToCart(product: Product): void {
    const qty = Number(product.orderQty);

    if (!qty || qty <= 0 || !Number.isInteger(qty)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        text: 'Please enter a valid positive quantity.'
      });
      return;
    }

    const existingItem = this.cartItems.find(x => x.productId === product.productId);

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      this.cartItems.push({
        productId: product.productId,
        productName: product.name,
        quantity: qty,
        freeQuantity: 0,
        mrp: product.mrp,
        ptr: product.ptr || 0,
        pts: product.pts || 0,
        discountPercent: product.discountPercent || 0,
        taxPercent: product.taxPercent || 0,
        finalPrice: product.finalPrice,
        batchNumber: '',
        expiryDate: null,
        imageUrl: product.imageUrl,
        remarks: product.name
      });
    }

    product.orderQty = 1;

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      timer: 1000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  }

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter(x => x.productId !== item.productId);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  }

  // Total payable calculated using the Final Price
  get totalAmount(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.quantity * item.finalPrice), 0);
  }

  placeOrder(): void {
    if (this.cartItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cart is Empty',
        text: 'Please add products to your cart before placing an order.'
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
        totalAmount: item.quantity * item.finalPrice,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        remarks: item.remarks
      }))
    };

    this.stockistService.stockist_create_order(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been created successfully.'
        });

        this.cartItems = [];
        this.remarks = '';
        this.getProducts();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: err?.error?.message || 'Failed to submit the order. Please try again.'
        });
      }
    });
  }
}