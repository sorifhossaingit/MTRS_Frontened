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
  Trash2,
  Route,
  UserCheck
} from 'lucide-angular';

import { MrService } from '../../services/mr.service';


// ======================================================
// INTERFACES
// ======================================================

interface RouteItem {
  routeId: number;
  routeName: string;
}

interface CustomerItem {
  customerId: number;
  name: string;
  type: string;
}

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
  sellingPrice: number;
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


// ======================================================
// COMPONENT
// ======================================================

@Component({
  selector: 'app-medicine-master',
  templateUrl: './medicine-master.component.html',
  styleUrl: './medicine-master.component.css'
})
export class MedicineMasterComponent implements OnInit {


  // ======================================================
  // LUCIDE ICONS
  // ======================================================

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
  Route = Route;
  UserCheck = UserCheck;


  // ======================================================
  // USER INFORMATION
  // ======================================================

  agencyId: number = 0;

  medicalRepresentativeId: number = 0;


  // ======================================================
  // ROUTE & CUSTOMER SELECTION
  // ======================================================

  routes: RouteItem[] = [];

  selectedRouteId: number | null = null;


  customers: CustomerItem[] = [];

  selectedCustomerId: number | null = null;

  loadingCustomers: boolean = false;


  // ======================================================
  // INVENTORY
  // ======================================================

  products: InventoryProduct[] = [];

  cart: CartItem[] = [];


  searchText: string = '';

  selectedCategory: string = '';

  categories: string[] = [];


  // ======================================================
  // PAGINATION
  // ======================================================

  pageNumber: number = 1;

  pageSize: number = 12;

  totalRecords: number = 0;

  totalPages: number = 0;


  // ======================================================
  // LOADING
  // ======================================================

  loading: boolean = false;

  placingOrder: boolean = false;


  // ======================================================
  // ORDER
  // ======================================================

  remarks: string = '';


  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(
    private mrService: MrService
  ) { }


  // ======================================================
  // ON INIT
  // ======================================================

  ngOnInit(): void {

    this.agencyId =
      Number(localStorage.getItem('aid')) || 0;

    this.medicalRepresentativeId =
      Number(localStorage.getItem('mid')) || 0;


    // console.log('Agency ID:', this.agencyId);

    // console.log(
    //   'Medical Representative ID:',
    //   this.medicalRepresentativeId
    // );


    if (!this.agencyId) {

      Swal.fire({
        icon: 'error',
        title: 'Agency Not Found',
        text: 'Agency information is missing. Please login again.'
      });

      return;
    }


    if (!this.medicalRepresentativeId) {

      Swal.fire({
        icon: 'error',
        title: 'MR Not Found',
        text: 'Medical Representative information is missing. Please login again.'
      });

      return;
    }


    // Load MR routes
    this.loadRoutes();


    // Load inventory
    this.loadInventory();
  }


  // ======================================================
  // LOAD ROUTES FOR MR
  // ======================================================

  loadRoutes(): void {

    if (!this.medicalRepresentativeId) {
      return;
    }


    this.mrService
      .get_routes_by_mr(this.medicalRepresentativeId)
      .subscribe({

        next: (res: any) => {

          // console.log(
          //   'Routes API Response:',
          //   res
          // );


          if (res?.success) {

            this.routes =
              res.data || [];

          } else {

            this.routes = [];

            Swal.fire({
              icon: 'warning',
              title: 'Routes',
              text:
                res?.message ||
                'No routes found for this Medical Representative.'
            });
          }
        },


        error: (err: any) => {

          console.error(
            'Routes Load Failed:',
            err
          );


          this.routes = [];


          Swal.fire({
            icon: 'error',
            title: 'Routes Load Failed',
            text: 'Unable to fetch routes.'
          });
        }

      });
  }


  // ======================================================
  // ROUTE CHANGE
  // ======================================================

  onRouteChange(): void {

    // Reset selected customer
    this.selectedCustomerId = null;

    this.customers = [];


    // No route selected
    if (!this.selectedRouteId) {
      return;
    }


    const agencyId =
      Number(localStorage.getItem('aid')) || 0;


    const mrId =
      Number(localStorage.getItem('mid')) || 0;


    // console.log(
    //   'Selected Route:',
    //   this.selectedRouteId
    // );

    // console.log(
    //   'Agency ID:',
    //   agencyId
    // );

    // console.log(
    //   'MR ID:',
    //   mrId
    // );


    // Validate Agency
    if (!agencyId) {

      Swal.fire({
        icon: 'error',
        title: 'Agency Not Found',
        text: 'Agency information is missing. Please login again.'
      });

      return;
    }


    // Validate MR
    if (!mrId) {

      Swal.fire({
        icon: 'error',
        title: 'MR Not Found',
        text: 'Medical Representative information is missing.'
      });

      return;
    }


    this.loadingCustomers = true;


    // ====================================================
    // CUSTOMER API
    //
    // routeId
    // agencyId
    // medicalRepresentativeId
    // ====================================================

    this.mrService
      .get_customers_by_route_mr(
        this.selectedRouteId,
        agencyId
      )
      .subscribe({

        next: (res: any) => {

          this.loadingCustomers = false;


          // console.log(
          //   'Customers API Response:',
          //   res
          // );


          /*
           * API response:
           *
           * {
           *   totalCount: 2,
           *   pageNumber: 1,
           *   pageSize: 10,
           *   data: [...]
           * }
           *
           * Therefore customers are inside res.data
           */


          if (Array.isArray(res)) {

            // Supports direct array response
            this.customers = res;

          } else if (Array.isArray(res?.data)) {

            // Supports paginated response
            this.customers = res.data;

          } else {

            this.customers = [];
          }


          // console.log(
          //   'Loaded Customers:',
          //   this.customers
          // );


          if (this.customers.length === 0) {

            Swal.fire({
              icon: 'info',
              title: 'No Customers',
              text: 'No customers found for the selected route.'
            });
          }

        },


        error: (err: any) => {

          this.loadingCustomers = false;

          this.customers = [];


          console.error(
            'Customers Load Failed:',
            err
          );


          Swal.fire({
            icon: 'error',
            title: 'Customers Load Failed',
            text:
              err?.error?.message ||
              'Unable to fetch customers for selected route.'
          });
        }

      });
  }


  // ======================================================
  // LOAD INVENTORY
  // ======================================================

  loadInventory(): void {

    this.loading = true;


    const mrId =
      Number(localStorage.getItem('mid')) || 0;


    // IMPORTANT:
    //
    // Search and Category must be undefined,
    // NOT null.
    //
    // Your service expects:
    //
    // Search?: string
    // Category?: string

    const params = {

      AgencyId: this.agencyId,

      MrId: mrId,

      Search:
        this.searchText?.trim() || undefined,

      Category:
        this.selectedCategory?.trim() || undefined,

      PageNumber:
        this.pageNumber,

      PageSize:
        this.pageSize
    };


    // console.log(
    //   'Inventory API Params:',
    //   params
    // );


    this.mrService
      .get_inventory_for_order(params)
      .subscribe({

        next: (res: any) => {

          this.loading = false;


          // console.log(
          //   'Inventory API Response:',
          //   res
          // );


          if (!res?.success) {

            this.products = [];

            this.totalRecords = 0;

            this.totalPages = 0;

            return;
          }


          const result =
            res.data;


          // ==================================================
          // PRODUCTS
          // ==================================================

          this.products =
            (result?.data || [])
              .map((item: any) => ({

                ...item,

                orderQty: 1

              }));


          // ==================================================
          // PAGINATION
          // ==================================================

          this.totalRecords =
            result?.totalRecords || 0;


          this.pageNumber =
            result?.pageNumber ||
            this.pageNumber;


          this.pageSize =
            result?.pageSize ||
            this.pageSize;


          this.totalPages =
            Math.ceil(
              this.totalRecords /
              this.pageSize
            );


          // ==================================================
          // CATEGORIES
          // ==================================================

          this.prepareCategories();
        },


        error: (err: any) => {

          this.loading = false;


          this.products = [];

          this.totalRecords = 0;

          this.totalPages = 0;


          console.error(
            'Inventory API Error:',
            err
          );


          Swal.fire({
            icon: 'error',
            title: 'Inventory',
            text:
              err?.error?.message ||
              'Unable to load inventory.'
          });
        }

      });
  }


  // ======================================================
  // PREPARE CATEGORIES
  // ======================================================

  prepareCategories(): void {

    const categorySet =
      new Set<string>();


    this.products.forEach(
      (product: InventoryProduct) => {

        if (product.category) {

          categorySet.add(
            product.category
          );

        }

      }
    );


    this.categories =
      Array.from(categorySet)
        .sort();
  }


  // ======================================================
  // REFRESH INVENTORY
  // ======================================================

  refreshInventory(): void {

    this.pageNumber = 1;

    this.loadInventory();
  }


  // ======================================================
  // SEARCH PRODUCTS
  // ======================================================

  searchProducts(): void {

    this.pageNumber = 1;

    this.loadInventory();
  }


  // ======================================================
  // CATEGORY CHANGE
  // ======================================================

  categoryChanged(): void {

    this.pageNumber = 1;

    this.loadInventory();
  }


  // ======================================================
  // CLEAR FILTERS
  // ======================================================

  clearFilters(): void {

    this.searchText = '';

    this.selectedCategory = '';

    this.pageNumber = 1;

    this.loadInventory();
  }


  // ======================================================
  // PAGINATION
  // ======================================================

  previousPage(): void {

    if (this.pageNumber <= 1) {
      return;
    }


    this.pageNumber--;

    this.loadInventory();
  }


  nextPage(): void {

    if (
      this.pageNumber >=
      this.totalPages
    ) {
      return;
    }


    this.pageNumber++;

    this.loadInventory();
  }


  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }


    this.pageNumber = page;

    this.loadInventory();
  }


  // ======================================================
  // INCREASE PRODUCT QUANTITY
  // ======================================================

  increaseQty(
    product: InventoryProduct
  ): void {

    if (!product.orderQty) {

      product.orderQty = 1;
    }


    if (
      product.orderQty >=
      product.quantity
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Maximum Quantity',
        text:
          'Requested quantity exceeds available stock.'
      });

      return;
    }


    product.orderQty++;
  }


  // ======================================================
  // DECREASE PRODUCT QUANTITY
  // ======================================================

  decreaseQty(
    product: InventoryProduct
  ): void {

    if (
      !product.orderQty ||
      product.orderQty <= 1
    ) {

      product.orderQty = 1;

      return;
    }


    product.orderQty--;
  }


  // ======================================================
  // VALIDATE PRODUCT QUANTITY
  // ======================================================

  validateQuantity(
    product: InventoryProduct
  ): void {

    if (
      !product.orderQty ||
      product.orderQty < 1
    ) {

      product.orderQty = 1;
    }


    if (
      product.orderQty >
      product.quantity
    ) {

      product.orderQty =
        product.quantity;


      Swal.fire({
        icon: 'warning',
        title: 'Quantity Updated',
        text:
          'Quantity adjusted to available stock.'
      });
    }
  }


  // ======================================================
  // ADD TO CART
  // ======================================================

  addToCart(
    product: InventoryProduct
  ): void {

    if (
      !product.isAvailable ||
      product.quantity <= 0
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Out of Stock',
        text:
          'This product is currently unavailable.'
      });

      return;
    }


    this.validateQuantity(product);


    const existing =
      this.cart.find(
        x =>
          x.inventoryId ===
          product.inventoryId
      );


    if (existing) {

      existing.orderQty =
        product.orderQty!;


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

      orderQty:
        product.orderQty!

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


  // ======================================================
  // REMOVE FROM CART
  // ======================================================

  removeFromCart(
    item: CartItem
  ): void {

    this.cart =
      this.cart.filter(
        x =>
          x.inventoryId !==
          item.inventoryId
      );
  }


  // ======================================================
  // INCREASE CART QUANTITY
  // ======================================================

  increaseCartQty(
    item: CartItem
  ): void {

    if (
      item.orderQty >=
      item.quantity
    ) {

      return;
    }


    item.orderQty++;
  }


  // ======================================================
  // DECREASE CART QUANTITY
  // ======================================================

  decreaseCartQty(
    item: CartItem
  ): void {

    if (
      item.orderQty <= 1
    ) {

      return;
    }


    item.orderQty--;
  }


  // ======================================================
  // VALIDATE CART QUANTITY
  // ======================================================

  validateCartQty(
    item: CartItem
  ): void {

    if (
      !item.orderQty ||
      item.orderQty < 1
    ) {

      item.orderQty = 1;
    }


    if (
      item.orderQty >
      item.quantity
    ) {

      item.orderQty =
        item.quantity;
    }
  }


  // ======================================================
  // CLEAR CART
  // ======================================================

  clearCart(): void {

    this.cart = [];

    this.remarks = '';
  }


  // ======================================================
  // CART COUNT
  // ======================================================

  getCartCount(): number {

    return this.cart.length;
  }


  // ======================================================
  // TOTAL QUANTITY
  // ======================================================

  getTotalQuantity(): number {

    return this.cart.reduce(
      (
        sum: number,
        item: CartItem
      ) =>
        sum + item.orderQty,

      0
    );
  }


  // ======================================================
  // SUB TOTAL
  // ======================================================

  getSubTotal(): number {

    return this.cart.reduce(
      (
        sum: number,
        item: CartItem
      ) =>
        sum +
        (
          item.orderQty *
          item.mrp
        ),

      0
    );
  }


  // ======================================================
  // TOTAL DISCOUNT
  // ======================================================

  getTotalDiscount(): number {

    return this.cart.reduce(
      (
        sum: number,
        item: CartItem
      ) => {

        const savingsPerUnit =
          item.mrp -
          item.sellingPrice;


        return sum +
          (
            savingsPerUnit > 0
              ? savingsPerUnit *
                item.orderQty
              : 0
          );
      },

      0
    );
  }


  // ======================================================
  // GRAND TOTAL
  // ======================================================

  getGrandTotal(): number {

    return this.cart.reduce(
      (
        sum: number,
        item: CartItem
      ) =>
        sum +
        (
          item.orderQty *
          item.sellingPrice
        ),

      0
    );
  }


  // ======================================================
  // CART CHECK
  // ======================================================

  hasItemsInCart(): boolean {

    return this.cart.length > 0;
  }


  isCartEmpty(): boolean {

    return this.cart.length === 0;
  }


  // ======================================================
  // SELECTED STOCKIST
  // ======================================================

  getSelectedStockistId(): number {

    return this.cart.length
      ? this.cart[0].stockistId
      : 0;
  }


  getSelectedStockistName(): string {

    return this.cart.length
      ? this.cart[0].stockistName
      : '';
  }


  // ======================================================
  // PLACE ORDER
  // ======================================================

  placeOrder(): void {

    // -----------------------------------------------
    // CART VALIDATION
    // -----------------------------------------------

    if (
      this.cart.length === 0
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text:
          'Please add at least one product.'
      });

      return;
    }


    // -----------------------------------------------
    // ROUTE VALIDATION
    // -----------------------------------------------

    if (
      !this.selectedRouteId
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Route Required',
        text:
          'Please select a route before placing the order.'
      });

      return;
    }


    // -----------------------------------------------
    // CUSTOMER VALIDATION
    // -----------------------------------------------

    if (
      !this.selectedCustomerId
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Customer Required',
        text:
          'Please select a customer for this order.'
      });

      return;
    }


    // -----------------------------------------------
    // CONFIRMATION
    // -----------------------------------------------

    Swal.fire({

      title: 'Place Order?',

      text:
        'Do you want to submit this order?',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText:
        'Yes, Place Order',

      cancelButtonText:
        'Cancel'

    }).then(
      (result) => {

        if (
          result.isConfirmed
        ) {

          this.submitOrder();
        }

      }
    );
  }


  // ======================================================
  // SUBMIT ORDER
  // ======================================================

  private submitOrder(): void {

    this.placingOrder = true;


    /*
     * IMPORTANT:
     *
     * Area Manager is NOT included.
     *
     * Order is created directly by MR
     * for selected customer.
     */


    const payload = {

      agencyId:
        this.agencyId,


      medicalRepresentativeId:
        this.medicalRepresentativeId,


      orderedFor:
        this.selectedCustomerId,


      orderDate:
        new Date().toISOString(),


      remarks:
        this.remarks,


      createdBy:
        this.medicalRepresentativeId,


      products:
        this.cart.map(
          (item: CartItem) => ({

            stockistId:
              item.stockistId,


            productId:
              item.productId ??
              null,


            stockistPersonalProductId:
              item.personalProductId ??
              null,


            quantity:
              item.orderQty,


            freeQuantity:
              0,


            mrp:
              item.mrp,


            ptr:
              0,


            pts:
              0,


            discountPercent:
              item.discountPercent ||
              0,


            taxPercent:
              item.taxPercent ||
              0,


            totalAmount:
              item.orderQty *
              item.sellingPrice,


            batchNumber:
              null,


            expiryDate:
              null,


            remarks:
              null

          })
        )
    };


    // console.log(
    //   'Create Order Payload:',
    //   payload
    // );


    this.mrService
      .mr_create_order(payload)
      .subscribe({

        next: (res: any) => {

          this.placingOrder = false;


          // console.log(
          //   'Create Order Response:',
          //   res
          // );


          if (res?.success) {

            Swal.fire({

              icon: 'success',

              title: 'Order Placed',

              text:
                res.message ||
                'Order placed successfully.'

            });


            // Clear cart
            this.clearCart();


            // Reload inventory
            this.loadInventory();

          } else {

            Swal.fire({

              icon: 'error',

              title: 'Order Failed',

              text:
                res?.message ||
                'Unable to place order.'

            });
          }

        },


        error: (err: any) => {

          this.placingOrder = false;


          console.error(
            'Create Order Error:',
            err
          );


          Swal.fire({

            icon: 'error',

            title: 'Error',

            text:
              err?.error?.message ||
              'Unable to place order.'

          });
        }

      });
  }


  // ======================================================
  // RESET ORDER
  // ======================================================

  resetOrder(): void {

    this.cart = [];

    this.remarks = '';
  }


  // ======================================================
  // PRODUCT IMAGE
  // ======================================================

  getProductImage(
    item: InventoryProduct
  ): string {

    if (
      item.imageUrl &&
      item.imageUrl.trim() !== ''
    ) {

      return item.imageUrl;
    }


    return 'assets/images/no-image.png';
  }


  // ======================================================
  // STOCK BADGE
  // ======================================================

  getStockBadge(
    product: InventoryProduct
  ): string {

    if (
      !product.isAvailable
    ) {

      return 'bg-red-100 text-red-700';
    }


    if (
      product.quantity <= 5
    ) {

      return 'bg-yellow-100 text-yellow-700';
    }


    return 'bg-green-100 text-green-700';
  }


  // ======================================================
  // NEAREST STOCKIST BADGE
  // ======================================================

  getNearestBadge(
    product: InventoryProduct
  ): string {

    return product.isNearestStockist

      ? 'bg-green-100 text-green-700'

      : 'bg-gray-100 text-gray-700';
  }

}