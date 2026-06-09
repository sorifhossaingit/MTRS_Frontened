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
import { StockistService } from '../../services/stockist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-master',
  templateUrl: './order-master.component.html',
  styleUrl: './order-master.component.css'
})
export class OrderMasterComponent implements OnInit {

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

  StockistId: any = localStorage.getItem('mid');

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
    private stockistService: StockistService
  ) { }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.getOrders();

  }



  // =====================================================
  // GET ORDERS
  // =====================================================

  getOrders() {

    this.loading = true;

    const params = {

      AgencyId: Number(this.agencyId),

      StockistId: Number(this.StockistId),

      Status: this.status,

      FromDate: this.fromDate,

      ToDate: this.toDate,

      PageNumber: this.pageNumber,

      PageSize: this.pageSize

    };

    this.stockistService
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
              (x: any) => x.status === 'Accepted'
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

          Swal.fire({
            icon: 'error',
            title: 'Loading Failed',
            text:
              err?.error?.message ||
              'Unable to load Order.',
            confirmButtonColor: '#dc2626'
          });

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

    this.stockistService
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

          Swal.fire({
            icon: 'error',
            title: 'Preview Failed',
            text:
              err?.error?.message ||
              'Unable to generate preview.',
            confirmButtonColor: '#dc2626'
          });

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
        status === 'Received'
          ? 'Recived By Stockist'
          : 'Not Recived By Stockist',

      updatedBy: this.StockistId

    };

    this.stockistService
      .update_stockist_status(payload)
      .subscribe({

        next: (res: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `Order ${status} Successfully`,
            confirmButtonColor: '#16a34a'
          });

          this.getOrders();

        },

        error: (err: any) => {

          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text:
              err?.error?.message ||
              'Failed To Update Status',
            confirmButtonColor: '#dc2626'
          });

        }

      });

  }

}
