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

  userId: any;

  orders: any[] = [];

  previewProducts: any[] = [];

  selectedOrder: any;

  showPreviewModal = false;

  loading = false;

  previewLoading = false;

  // KPI

  totalOrders = 0;
  pending = 0;
  approved = 0;
  rejected = 0;

  // Filters

  stockistName = '';
  mobile = '';
  status = '';

  fromDate = '';
  toDate = '';

  // Pagination

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private productService: ProductService
  ) {}

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

  decodeToken() {

    const token =
      localStorage.getItem('token');

    if (token) {

      const decoded: any =
        jwtDecode(token);

      this.userId =
        decoded?.userId ||
        decoded?.UserId ||
        decoded?.id ||
        0;
    }

  }

  // =====================================================
  // GET ORDERS
  // =====================================================

  getOrders() {

    this.loading = true;

    const params = {

      AgencyId: Number(this.agencyId),

      StockistName: this.stockistName,

      Mobile: this.mobile,

      Status: this.status,

      FromDate: this.fromDate ,

      ToDate: this.toDate ,

      PageNumber: this.pageNumber,

      PageSize: this.pageSize

    };

    this.productService
      .getstockistorderdetails(params)
      .subscribe({

        next: (res: any) => {

          this.orders =
            res?.data || [];

          this.totalOrders =
            res?.totalCount || 0;

          this.totalPages =
            res?.totalPages || 0;

          this.pending =
            this.orders.filter(
              (x: any) => x.status === 'Pending'
            ).length;

          this.approved =
            this.orders.filter(
              (x: any) => x.status === 'Approved'
            ).length;

          this.rejected =
            this.orders.filter(
              (x: any) => x.status === 'Rejected'
            ).length;

          this.loading = false;

        },

        error: (err: any) => {

          console.log(err);

          this.loading = false;

        }

      });

  }

  // =====================================================
  // FILTER
  // =====================================================

  applyFilter() {

    this.pageNumber = 1;

    this.getOrders();

  }

  resetFilter() {

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

  nextPage() {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.getOrders();

    }

  }

  previousPage() {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.getOrders();

    }

  }

  // =====================================================
  // VIEW ORDER
  // =====================================================

  viewOrder(order: any) {

    this.selectedOrder = order;

    this.showPreviewModal = true;

    this.previewLoading = true;

    this.productService
      .getstockistorderpreview(order.orderId)
      .subscribe({

        next: (res: any) => {

          this.previewProducts =
            res || [];

          this.previewLoading = false;

        },

        error: (err: any) => {

          console.log(err);

          this.previewLoading = false;

        }

      });

  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeModal() {

    this.showPreviewModal = false;

    this.previewProducts = [];

  }

  // =====================================================
  // APPROVE / REJECT
  // =====================================================

  updateStatus(
    order: any,
    status: string
  ) {

    const payload = {

      orderId: order.orderId,

      status: status,

      remarks:
        status === 'Approved'
          ? 'Approved By Admin'
          : 'Rejected By Admin',

      updatedBy: this.userId

    };

    this.productService
      .updateorderstatus(payload)
      .subscribe({

        next: (res: any) => {

          alert(
            `Order ${status} Successfully`
          );

          this.getOrders();

        },

        error: (err: any) => {

          console.log(err);

          alert(
            'Failed To Update Status'
          );

        }

      });

  }

}
