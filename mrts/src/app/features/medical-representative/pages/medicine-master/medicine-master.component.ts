import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  Package,
  ShoppingCart,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  Minus,
  ShoppingBag,
  Trash2
} from 'lucide-angular';
import { MrService } from '../../services/mr.service';

interface InventoryProduct {
  inventoryId: number;
  inventoryUuid: string;
  stockistId: number;
  stockistName: string;
  isNearestStockist: boolean;
  productId: number | null;
  personalProductId: number | null;
  productName: string;
  brandName: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  mrp: number;
  sellingPrice: number; // Pre-calculated discounted price from API
  taxPercent: number;
  discountPercent: number;
  quantity: number;
  isAvailable: boolean;
  imageUrl: string;
  orderQty?: number;
}

interface CartItem extends InventoryProduct {
  orderQty: number;
}

@Component({
  selector: 'app-medicine-master',
  templateUrl: './medicine-master.component.html',
  styleUrl: './medicine-master.component.css'
})
export class MedicineMasterComponent implements OnInit {

  Package = Package;
  ShoppingCart = ShoppingCart;
  Search = Search;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;
  MapPin = MapPin;
  Plus = Plus;
  Minus = Minus;
  ShoppingBag = ShoppingBag;
  Trash2 = Trash2;

  agencyId: number = 0;
  medicalRepresentativeId: number = 0;
  areaManagerId: number = 0;

  products: InventoryProduct[] = [];
  cart: CartItem[] = [];

  searchText = '';
  selectedCategory = '';
  categories: string[] = [];

  pageNumber = 1;
  pageSize = 12;
  totalRecords = 0;
  totalPages = 0;

  loading = false;
  placingOrder = false;
  remarks = '';

  constructor(private mrService: MrService) { }

  ngOnInit(): void {
    this.agencyId = Number(localStorage.getItem('aid'));
    this.medicalRepresentativeId = Number(localStorage.getItem('mid'));
    this.getAssignedAreaManager();
  }

  getAssignedAreaManager(): void {
    const params = { medicalRepresentativeId: this.medicalRepresentativeId };
    this.loading = true;

    this.mrService.get_assigned_area_manager(params).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.areaManagerId = res.data.areaManagerId;
          this.loadInventory();
        } else {
          this.loading = false;
          Swal.fire({
            icon: 'warning',
            title: 'Area Manager',
            text: res.message || 'Assigned Area Manager not found.'
          });
        }
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to fetch Assigned Area Manager.'
        });
      }
    });
  }

  loadInventory(): void {
    this.loading = true;

    const params = {
      AgencyId: this.agencyId,
      AssignedAreaManager: this.areaManagerId,
      Search: this.searchText?.trim(),
      Category: this.selectedCategory,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize
    };

    this.mrService.get_inventory_for_order(params).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (!res.success) {
          this.products = [];
          this.totalRecords = 0;
          this.totalPages = 0;
          return;
        }

        const result = res.data;

        this.products = (result.data || []).map((item: any) => ({
          ...item,
          orderQty: 1
        }));

        this.totalRecords = result.totalRecords;
        this.pageNumber = result.pageNumber;
        this.pageSize = result.pageSize;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        this.prepareCategories();
      },
      error: () => {
        this.loading = false;
        this.products = [];
        Swal.fire({
          icon: 'error',
          title: 'Inventory',
          text: 'Unable to load inventory.'
        });
      }
    });
  }

  prepareCategories(): void {
    const categorySet = new Set<string>();
    this.products.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  refreshInventory(): void {
    this.pageNumber = 1;
    this.loadInventory();
  }

  searchProducts(): void {
    this.pageNumber = 1;
    this.loadInventory();
  }

  categoryChanged(): void {
    this.pageNumber = 1;
    this.loadInventory();
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedCategory = '';
    this.pageNumber = 1;
    this.loadInventory();
  }

  previousPage(): void {
    if (this.pageNumber <= 1) return;
    this.pageNumber--;
    this.loadInventory();
  }

  nextPage(): void {
    if (this.pageNumber >= this.totalPages) return;
    this.pageNumber++;
    this.loadInventory();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.loadInventory();
  }

  increaseQty(product: InventoryProduct): void {
    if (!product.orderQty) product.orderQty = 1;

    if (product.orderQty >= product.quantity) {
      Swal.fire({
        icon: 'warning',
        title: 'Maximum Quantity',
        text: 'Requested quantity exceeds available stock.'
      });
      return;
    }
    product.orderQty++;
  }

  decreaseQty(product: InventoryProduct): void {
    if (!product.orderQty || product.orderQty <= 1) {
      product.orderQty = 1;
      return;
    }
    product.orderQty--;
  }

  validateQuantity(product: InventoryProduct): void {
    if (!product.orderQty || product.orderQty < 1) {
      product.orderQty = 1;
    }
    if (product.orderQty > product.quantity) {
      product.orderQty = product.quantity;
      Swal.fire({
        icon: 'warning',
        title: 'Quantity Updated',
        text: 'Quantity adjusted to available stock.'
      });
    }
  }

  addToCart(product: InventoryProduct): void {
    if (!product.isAvailable || product.quantity <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Out of Stock',
        text: 'This product is currently unavailable.'
      });
      return;
    }

    this.validateQuantity(product);

    const existing = this.cart.find(x => x.inventoryId === product.inventoryId);

    if (existing) {
      existing.orderQty = product.orderQty!;
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cart updated',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.cart.push({
      ...product,
      orderQty: product.orderQty!
    });

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Added to cart',
      showConfirmButton: false,
      timer: 1500
    });
  }

  removeFromCart(item: CartItem): void {
    this.cart = this.cart.filter(x => x.inventoryId !== item.inventoryId);
  }

  increaseCartQty(item: CartItem): void {
    if (item.orderQty >= item.quantity) return;
    item.orderQty++;
  }

  decreaseCartQty(item: CartItem): void {
    if (item.orderQty <= 1) return;
    item.orderQty--;
  }

  validateCartQty(item: CartItem): void {
    if (!item.orderQty || item.orderQty < 1) item.orderQty = 1;
    if (item.orderQty > item.quantity) item.orderQty = item.quantity;
  }

  clearCart(): void {
    this.cart = [];
    this.remarks = '';
  }

  getCartCount(): number {
    return this.cart.length;
  }

  getTotalQuantity(): number {
    return this.cart.reduce((sum, item) => sum + item.orderQty, 0);
  }

  // --- REVISED PRICING METHODS ---

  // Subtotal based on Original MRP
  getSubTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.orderQty * item.mrp), 0);
  }

  // Total discount saved (MRP - sellingPrice)
  getTotalDiscount(): number {
    return this.cart.reduce((sum, item) => {
      const savingsPerUnit = item.mrp - item.sellingPrice;
      return sum + (savingsPerUnit > 0 ? savingsPerUnit * item.orderQty : 0);
    }, 0);
  }

  // Grand Total based on pre-calculated sellingPrice
  getGrandTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.orderQty * item.sellingPrice), 0);
  }

  hasItemsInCart(): boolean {
    return this.cart.length > 0;
  }

  getSelectedStockistId(): number {
    return this.cart.length ? this.cart[0].stockistId : 0;
  }

  getSelectedStockistName(): string {
    return this.cart.length ? this.cart[0].stockistName : '';
  }

  placeOrder(): void {
    if (this.cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Please add at least one product.'
      });
      return;
    }

    Swal.fire({
      title: 'Place Order?',
      text: 'Do you want to submit this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Place Order',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitOrder();
      }
    });
  }

  private submitOrder(): void {
    this.placingOrder = true;

    const payload = {
      agencyId: this.agencyId,
      medicalRepresentativeId: this.medicalRepresentativeId,
      areaManagerId: this.areaManagerId,
      orderedFor: null,
      orderDate: new Date().toISOString(),
      remarks: this.remarks,
      createdBy: this.medicalRepresentativeId,
      products: this.cart.map(item => ({
        stockistId: item.stockistId,
        productId: item.productId ?? null,
        stockistPersonalProductId: item.personalProductId ?? null,
        quantity: item.orderQty,
        freeQuantity: 0,
        mrp: item.mrp,
        ptr: 0,
        pts: 0,
        discountPercent: item.discountPercent || 0,
        taxPercent: item.taxPercent || 0,
        totalAmount: item.orderQty * item.sellingPrice,
        batchNumber: null,
        expiryDate: null,
        remarks: null
      }))
    };

    this.mrService.mr_create_order(payload).subscribe({
      next: (res: any) => {
        this.placingOrder = false;
        if (res.success) {
          Swal.fire({
            icon: 'success',
            title: 'Order Placed',
            text: res.message
          });
          this.clearCart();
          this.loadInventory();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Order Failed',
            text: res.message
          });
        }
      },
      error: () => {
        this.placingOrder = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to place order.'
        });
      }
    });
  }

  isCartEmpty(): boolean {
    return this.cart.length === 0;
  }

  resetOrder(): void {
    this.cart = [];
    this.remarks = '';
  }

  getProductImage(item: InventoryProduct): string {
    if (item.imageUrl && item.imageUrl.trim() !== '') {
      return item.imageUrl;
    }
    return 'assets/images/no-image.png';
  }

  getStockBadge(product: InventoryProduct): string {
    if (!product.isAvailable) return 'bg-red-100 text-red-700';
    if (product.quantity <= 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }

  getNearestBadge(product: InventoryProduct): string {
    return product.isNearestStockist
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  }
}