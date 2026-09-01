
import { Component, OnInit } from '@angular/core';
import {
  ClipboardList,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  X
} from 'lucide-angular';
import { jwtDecode } from 'jwt-decode';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stockist-order-details',
  templateUrl: './stockist-order-details.component.html',
  styleUrl: './stockist-order-details.component.css'
})
export class StockistOrderDetailsComponent implements OnInit {

  // =====================================================
  // ICONS
  // =====================================================

  ClipboardList = ClipboardList;
  Package = Package;
  Clock = Clock;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  Eye = Eye;
  X = X;

  // =====================================================
  // VARIABLES
  // =====================================================

  agencyId: any = localStorage.getItem('aid');

  userId: any = 0;

  orders: any[] = [];

  previewProducts: any[] = [];

  selectedOrder: any = null;

  showPreviewModal = false;

  loading = false;

  previewLoading = false;

  editingOrder = false;

  savingOrder = false;

  acceptedProducts: any[] = [];

  // =====================================================
  // KPI
  // =====================================================

  totalOrders = 0;
  pending = 0;
  approved = 0;
  rejected = 0;

  // =====================================================
  // FILTERS
  // =====================================================

  stockistName = '';
  mobile = '';
  status = '';

  fromDate = '';
  toDate = '';

  // =====================================================
  // PAGINATION
  // =====================================================

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private productService: ProductService
  ) { }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.decodeToken();

    this.getOrders();

  }

  // =====================================================
  // TOKEN
  // =====================================================

  decodeToken(): void {

    try {

      const token = localStorage.getItem('token');

      if (!token) {
        this.userId = 0;
        return;
      }

      const decoded: any = jwtDecode(token);

      this.userId =
        decoded?.userId ||
        decoded?.UserId ||
        decoded?.id ||
        0;

    } catch (error) {

      console.error('Token decode failed:', error);

      this.userId = 0;

    }

  }

  // =====================================================
  // GET ORDERS
  // =====================================================

  getOrders(): void {

    this.loading = true;

    const params = {

      AgencyId: Number(this.agencyId),

      StockistName: this.stockistName,

      Mobile: this.mobile,

      Status: this.status,

      FromDate: this.fromDate,

      ToDate: this.toDate,

      PageNumber: this.pageNumber,

      PageSize: this.pageSize

    };

    this.productService
      .getstockistorderdetails(params)
      .subscribe({

        next: (res: any) => {

          this.orders = res?.data || [];

          this.totalOrders =
            res?.totalCount || 0;

          this.totalPages =
            res?.totalPages || 0;

          // -------------------------------------------------
          // PENDING
          // -------------------------------------------------

          this.pending =
            this.orders.filter(
              (x: any) =>
                x.status === 'Pending'
            ).length;

          // -------------------------------------------------
          // ACCEPTED / APPROVED
          // -------------------------------------------------

          this.approved =
            this.orders.filter(
              (x: any) =>
                x.status === 'Accepted' ||
                x.status === 'Approved'
            ).length;

          // -------------------------------------------------
          // REJECTED
          // -------------------------------------------------

          this.rejected =
            this.orders.filter(
              (x: any) =>
                x.status === 'Rejected'
            ).length;

          this.loading = false;

        },

        error: (err: any) => {

          console.error(
            'Get orders failed:',
            err
          );

          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text:
              err?.error?.message ||
              'Unable to load stockist orders.',
            confirmButtonColor: '#dc2626'
          });

        }

      });

  }

  // =====================================================
  // FILTER
  // =====================================================

  applyFilter(): void {

    this.pageNumber = 1;

    this.getOrders();

  }

  // =====================================================
  // RESET FILTER
  // =====================================================

  resetFilter(): void {

    this.stockistName = '';

    this.mobile = '';

    this.status = '';

    this.fromDate = '';

    this.toDate = '';

    this.pageNumber = 1;

    this.getOrders();

  }

  // =====================================================
  // PAGINATION
  // =====================================================

  nextPage(): void {

    if (
      this.pageNumber <
      this.totalPages
    ) {

      this.pageNumber++;

      this.getOrders();

    }

  }

  // =====================================================
  // PREVIOUS PAGE
  // =====================================================

  previousPage(): void {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.getOrders();

    }

  }

  // =====================================================
  // VIEW ORDER
  // =====================================================

  viewOrder(order: any): void {

    this.selectedOrder = order;

    this.showPreviewModal = true;

    this.previewLoading = true;

    this.editingOrder = false;

    this.savingOrder = false;

    this.previewProducts = [];

    this.productService
      .getstockistorderpreview(
        order.orderId
      )
      .subscribe({

        next: (res: any) => {

          this.previewProducts =
            res || [];

          // -------------------------------------------------
          // INITIAL ACCEPTED QUANTITY
          // -------------------------------------------------

          this.previewProducts.forEach(
            (item: any) => {

              const ordered =
                Number(item.quantity) || 0;

              // Initially accept full ordered quantity
              item.acceptQuantity =
                ordered;

              // No balance initially
              item.balanceQuantity =
                0;

            }
          );

          this.previewLoading = false;

        },

        error: (err: any) => {

          console.error(
            'Preview failed:',
            err
          );

          this.previewLoading = false;

          Swal.fire({
            icon: 'error',
            title: 'Preview Failed',
            text:
              err?.error?.message ||
              'Unable to load order preview.',
            confirmButtonColor: '#dc2626'
          });

        }

      });

  }

  // =====================================================
  // START EDIT
  // =====================================================

  startEditOrder(): void {

    if (!this.selectedOrder) {
      return;
    }

    if (
      this.selectedOrder.status !==
      'Pending'
    ) {

      Swal.fire({
        icon: 'info',
        title: 'Cannot Edit',
        text:
          'Only pending orders can be edited.'
      });

      return;

    }

    this.editingOrder = true;

    this.previewProducts.forEach(
      (item: any) => {

        const ordered =
          Number(item.quantity) || 0;

        item.acceptQuantity =
          ordered;

        item.balanceQuantity =
          0;

      }
    );

  }

  // =====================================================
  // CALCULATE ACCEPTED QUANTITY
  // =====================================================

  calculateAcceptedQuantity(
    item: any
  ): void {

    const ordered =
      Number(item.quantity) || 0;

    let accepted =
      Number(item.acceptQuantity);

    // -------------------------------------------------
    // INVALID VALUE
    // -------------------------------------------------

    if (
      isNaN(accepted) ||
      accepted < 0
    ) {

      accepted = 0;

    }

    // -------------------------------------------------
    // MAXIMUM
    // -------------------------------------------------

    if (
      accepted > ordered
    ) {

      accepted = ordered;

    }

    // -------------------------------------------------
    // SET ACCEPTED
    // -------------------------------------------------

    item.acceptQuantity =
      accepted;

    // -------------------------------------------------
    // BALANCE
    // -------------------------------------------------

    item.balanceQuantity =
      ordered - accepted;

  }

  // =====================================================
  // CALCULATE ACCEPTED AMOUNT
  //
  // IMPORTANT:
  // MRP -> DISCOUNT -> TAX
  //
  // NOT PTR
  // =====================================================

  calculateAcceptedAmount(
    item: any
  ): number {

    const quantity =
      Number(item.acceptQuantity) || 0;

    const mrp =
      Number(item.mrp) || 0;

    const discount =
      Number(item.discountPercent) || 0;

    const tax =
      Number(item.taxPercent) || 0;

    // -------------------------------------------------
    // GROSS AMOUNT
    // MRP × ACCEPTED QUANTITY
    // -------------------------------------------------

    const grossAmount =
      quantity * mrp;

    // -------------------------------------------------
    // DISCOUNT
    // -------------------------------------------------

    const discountAmount =
      grossAmount *
      discount /
      100;

    const amountAfterDiscount =
      grossAmount -
      discountAmount;

    // -------------------------------------------------
    // TAX
    // -------------------------------------------------

    const taxAmount =
      amountAfterDiscount *
      tax /
      100;

    // -------------------------------------------------
    // FINAL AMOUNT
    // -------------------------------------------------

    const finalAmount =
      amountAfterDiscount +
      taxAmount;

    return Number(
      finalAmount.toFixed(2)
    );

  }

  // =====================================================
  // ACCEPTED TOTAL
  // =====================================================

  getAcceptedTotalAmount(): number {

    const total =
      this.previewProducts.reduce(
        (
          sum: number,
          item: any
        ) => {

          return (
            sum +
            this.calculateAcceptedAmount(
              item
            )
          );

        },
        0
      );

    return Number(
      total.toFixed(2)
    );

  }

  // =====================================================
  // ACCEPT ORDER
  // =====================================================

  acceptOrder(): void {

    if (!this.selectedOrder) {
      return;
    }

    if (
      this.selectedOrder.status !==
      'Pending'
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Order',
        text:
          'Only pending orders can be accepted.'
      });

      return;

    }

    // -------------------------------------------------
    // VALIDATE PRODUCTS
    // -------------------------------------------------

    for (
      const item of this.previewProducts
    ) {

      const ordered =
        Number(item.quantity) || 0;

      const accepted =
        Number(item.acceptQuantity) || 0;

      // Negative
      if (accepted < 0) {

        Swal.fire({
          icon: 'warning',
          title: 'Invalid Quantity',
          text:
            `Accepted quantity cannot be negative for ${item.productName}.`
        });

        return;

      }

      // Greater than ordered
      if (accepted > ordered) {

        Swal.fire({
          icon: 'warning',
          title: 'Invalid Quantity',
          text:
            `Accepted quantity cannot be greater than ordered quantity for ${item.productName}.`
        });

        return;

      }

    }

    // -------------------------------------------------
    // AT LEAST ONE PRODUCT
    // -------------------------------------------------

    const totalAcceptedQuantity =
      this.previewProducts.reduce(
        (
          total: number,
          item: any
        ) => {

          return (
            total +
            (
              Number(
                item.acceptQuantity
              ) || 0
            )
          );

        },
        0
      );

    if (
      totalAcceptedQuantity <= 0
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'No Quantity Accepted',
        text:
          'Please accept at least one product quantity.'
      });

      return;

    }

    // -------------------------------------------------
    // CONFIRM
    // -------------------------------------------------

    Swal.fire({

      title: 'Accept Order?',

      html: `
        <div class="text-left">
          <p class="mb-2">
            The accepted quantity will be updated.
          </p>

          <p class="font-semibold">
            Accepted Amount:
            ₹${this.getAcceptedTotalAmount().toFixed(2)}
          </p>
        </div>
      `,

      icon: 'question',

      showCancelButton: true,

      confirmButtonText:
        'Yes, Accept',

      cancelButtonText:
        'Cancel',

      confirmButtonColor:
        '#16a34a'

    }).then((result) => {

      if (
        result.isConfirmed
      ) {

        this.saveAcceptedOrder();

      }

    });

  }

  // =====================================================
  // SAVE ACCEPTED ORDER
  // =====================================================

  saveAcceptedOrder(): void {

    if (!this.selectedOrder) {
      return;
    }

    this.savingOrder = true;

    // -------------------------------------------------
    // BUILD PRODUCTS
    //
    // quantity = ACCEPTED QUANTITY
    // -------------------------------------------------

    const products =
      this.previewProducts

        // Remove zero accepted quantity
        .filter(
          (item: any) =>
            (
              Number(
                item.acceptQuantity
              ) || 0
            ) > 0
        )

        .map(
          (item: any) => {

            const acceptedQuantity =
              Number(
                item.acceptQuantity
              ) || 0;

            return {

              productId:
                Number(
                  item.productId
                ),

              // IMPORTANT:
              // Send ACCEPTED quantity
              quantity:
                acceptedQuantity,

              freeQuantity:
                Number(
                  item.freeQuantity
                ) || 0,

              mrp:
                Number(
                  item.mrp
                ) || 0,

              ptr:
                Number(
                  item.ptr
                ) || 0,

              pts:
                Number(
                  item.pts
                ) || 0,

              discountPercent:
                Number(
                  item.discountPercent
                ) || 0,

              taxPercent:
                Number(
                  item.taxPercent
                ) || 0,

              // MRP based calculation
              totalAmount:
                this.calculateAcceptedAmount(
                  item
                ),

              batchNumber:
                item.batchNumber ||
                null,

              expiryDate:
                item.expiryDate ||
                null,

              remarks:
                item.remarks ||
                null

            };

          }
        );

    // -------------------------------------------------
    // VALIDATE
    // -------------------------------------------------

    if (
      products.length === 0
    ) {

      this.savingOrder = false;

      Swal.fire({
        icon: 'warning',
        title: 'No Quantity Accepted',
        text:
          'Please accept at least one product quantity.'
      });

      return;

    }

    // -------------------------------------------------
    // TOTAL
    // -------------------------------------------------

    const totalAmount =
      products.reduce(
        (
          sum: number,
          item: any
        ) => {

          return (
            sum +
            Number(
              item.totalAmount || 0
            )
          );

        },
        0
      );

    // -------------------------------------------------
    // UPDATE ORDER PAYLOAD
    // -------------------------------------------------

    const payload = {

      agencyId:
        Number(
          this.selectedOrder.agencyId ||
          this.agencyId ||
          0
        ),

      stockistId:
        Number(
          this.selectedOrder.stockistId ||
          0
        ),

      orderDate:
        this.selectedOrder.orderDate,

      totalAmount:
        Number(
          totalAmount.toFixed(2)
        ),

      remarks:
        'Order Accepted By Admin',

      createdBy:
        Number(
          this.userId || 0
        ),

      products:
        products

    };

    console.log(
      'UPDATE ORDER PAYLOAD:',
      payload
    );

    // -------------------------------------------------
    // STEP 1
    // UPDATE ACCEPTED QUANTITY
    // -------------------------------------------------

    this.productService
      .updateStockistOrder(
        this.selectedOrder.orderId,
        payload
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'ORDER UPDATE SUCCESS:',
            res
          );

          // -------------------------------------------------
          // STEP 2
          // UPDATE STATUS
          // -------------------------------------------------

          this.updateStatusAfterQuantityUpdate();

        },

        error: (err: any) => {

          console.error(
            'Order quantity update failed:',
            err
          );

          this.savingOrder = false;

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text:
              err?.error?.message ||
              'Unable to update accepted quantity.',
            confirmButtonColor:
              '#dc2626'
          });

        }

      });

  }

  // =====================================================
  // UPDATE STATUS AFTER QUANTITY UPDATE
  // =====================================================

  updateStatusAfterQuantityUpdate(): void {

    if (!this.selectedOrder) {

      this.savingOrder = false;

      return;

    }

    const payload = {

      orderId:
        Number(
          this.selectedOrder.orderId
        ),

      status:
        'Accepted',

      remarks:
        'Approved By Admin',

      updatedBy:
        String(
          this.userId || 0
        )

    };

    console.log(
      'UPDATE STATUS PAYLOAD:',
      payload
    );

    this.productService
      .updateorderstatus(payload)
      .subscribe({

        next: (res: any) => {

          console.log(
            'STATUS UPDATE SUCCESS:',
            res
          );

          this.savingOrder = false;

          this.editingOrder = false;

          Swal.fire({
            icon: 'success',
            title: 'Order Accepted',
            text:
              'Accepted quantity and order status updated successfully.',
            confirmButtonColor:
              '#16a34a'
          }).then(() => {

            this.closeModal();

            this.getOrders();

          });

        },

        error: (err: any) => {

          console.error(
            'Status update failed:',
            err
          );

          this.savingOrder = false;

          Swal.fire({
            icon: 'error',
            title: 'Status Update Failed',
            text:
              err?.error?.message ||
              'Quantity was updated, but order status could not be updated.',
            confirmButtonColor:
              '#dc2626'
          });

        }

      });

  }

  // =====================================================
  // APPROVE / REJECT
  // =====================================================

  updateStatus(
    order: any,
    status: string
  ): void {

    if (!order) {
      return;
    }

    // -------------------------------------------------
    // ACCEPTED
    // -------------------------------------------------

    if (status === 'Accepted') {

      // Open quantity editor
      this.viewOrder(order);

      return;

    }

    // -------------------------------------------------
    // REJECT
    // -------------------------------------------------

    if (status === 'Rejected') {

      Swal.fire({

        title: 'Reject Order?',

        text:
          'Are you sure you want to reject this order?',

        icon: 'warning',

        showCancelButton: true,

        confirmButtonText:
          'Yes, Reject',

        cancelButtonText:
          'Cancel',

        confirmButtonColor:
          '#dc2626'

      }).then((result) => {

        if (
          result.isConfirmed
        ) {

          this.changeOrderStatus(
            order,
            'Rejected'
          );

        }

      });

    }

  }

  // =====================================================
  // CHANGE ORDER STATUS
  // =====================================================

  changeOrderStatus(
    order: any,
    status: string
  ): void {

    const payload = {

      orderId:
        Number(
          order.orderId
        ),

      status:
        status,

      remarks:
        status === 'Accepted'
          ? 'Approved By Admin'
          : 'Rejected By Admin',

      updatedBy:
        String(
          this.userId || 0
        )

    };

    console.log(
      'STATUS PAYLOAD:',
      payload
    );

    this.loading = true;

    this.productService
      .updateorderstatus(payload)
      .subscribe({

        next: (res: any) => {

          console.log(
            'Status updated:',
            res
          );

          this.loading = false;

          Swal.fire({

            icon: 'success',

            title:
              status === 'Accepted'
                ? 'Order Accepted'
                : 'Order Rejected',

            text:
              status === 'Accepted'
                ? 'Order accepted successfully.'
                : 'Order rejected successfully.',

            confirmButtonColor:
              status === 'Accepted'
                ? '#16a34a'
                : '#dc2626'

          }).then(() => {

            this.getOrders();

          });

        },

        error: (err: any) => {

          console.error(
            'Status update failed:',
            err
          );

          this.loading = false;

          Swal.fire({

            icon: 'error',

            title: 'Failed',

            text:
              err?.error?.message ||
              'Failed to update order status.',

            confirmButtonColor:
              '#dc2626'

          });

        }

      });

  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeModal(): void {

    if (this.savingOrder) {
      return;
    }

    this.showPreviewModal = false;

    this.editingOrder = false;

    this.previewProducts = [];

    this.selectedOrder = null;

  }

}

