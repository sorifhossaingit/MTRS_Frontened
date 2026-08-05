import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  MapPin,
  FileText,
  Building
} from 'lucide-angular';
import Swal from 'sweetalert2';
import { MrService } from '../../services/mr.service';

@Component({
  selector: 'app-mr-order-master',
  templateUrl: './mr-order-master.component.html',
  styleUrl: './mr-order-master.component.css'
})
export class MrOrderMasterComponent implements OnInit {

  // Lucide Icons
  ShoppingCart = ShoppingCart;
  Clock = Clock;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  Eye = Eye;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;
  X = X;
  User = User;
  MapPin = MapPin;
  FileText = FileText;
  Building = Building;

  filterForm!: FormGroup;

  orders: any[] = [];
  previewProducts: any[] = [];

  showPreviewModal = false;
  selectedOrder: any = null;

  isLoading = false;

  // KPI
  totalOrders = 0;
  pendingOrders = 0;
  acceptedOrders = 0;
  rejectedOrders = 0;

  // Pagination
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  constructor(
    private fb: FormBuilder,
    private mrservice: MrService
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      status: [''],
      minAmount: [null],
      maxAmount: [null],
      customerName: ['']
    });

    this.getOrders();
  }

  // ===========================
  // GET ORDERS
  // ===========================
  getOrders(): void {
    this.isLoading = true;

    const payload = {
      agencyId: Number(localStorage.getItem('aid')),
      stockistId: null,
      medicalRepresentativeId: Number(localStorage.getItem('mid')),
      medicalRepresentativeName: null,
      mobileNumber: null,
      customerName: this.filterForm.value.customerName || null,
      status: this.filterForm.value.status || null,
      minAmount: this.filterForm.value.minAmount || null,
      maxAmount: this.filterForm.value.maxAmount || null,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.mrservice.get_mr_order_list(payload).subscribe({
      next: (res: any) => {
        const response = res.data;

        this.orders = response.data || [];
        this.totalRecords = response.totalCount || 0;
        this.pageNumber = response.pageNumber || 1;
        this.pageSize = response.pageSize || 10;
        this.totalPages = response.totalPages || 0;

        this.calculateKpis();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Failed to load orders'
        });
      }
    });
  }

  // ===========================
  // KPI CALCULATIONS
  // ===========================
  calculateKpis(): void {
    this.totalOrders = this.totalRecords;
    this.pendingOrders = this.orders.filter(x => x.Status === 'Pending').length;
    this.acceptedOrders = this.orders.filter(x => x.Status === 'Accepted').length;
    this.rejectedOrders = this.orders.filter(x => x.Status === 'Rejected').length;
  }

  // ===========================
  // FILTERS
  // ===========================
  applyFilters(): void {
    this.pageNumber = 1;
    this.getOrders();
  }

  resetFilters(): void {
    this.filterForm.reset({
      status: '',
      minAmount: null,
      maxAmount: null,
      customerName: ''
    });
    this.pageNumber = 1;
    this.getOrders();
  }

  // ===========================
  // PAGINATION
  // ===========================
  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getOrders();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getOrders();
    }
  }

  // ===========================
  // PREVIEW ORDER
  // ===========================
  viewOrder(order: any): void {
    this.selectedOrder = order;

    this.mrservice.get_mr_order_preview(order.OrderId).subscribe({
      next: (res: any) => {
        this.previewProducts = res.data || [];
        this.showPreviewModal = true;
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Unable to load order preview'
        });
      }
    });
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.previewProducts = [];
    this.selectedOrder = null;
  }

  // ===========================
  // UPDATE STATUS
  // ===========================
  updateStatus(orderId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update status for this order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then(result => {
      if (!result.isConfirmed) return;

      const payload = {
        orderId: orderId,
        updatedBy: Number(localStorage.getItem('mid'))
      };

      this.mrservice.update_order_status_by_mr(payload).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Order status updated successfully'
          });
          this.getOrders();
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'Status update failed'
          });
        }
      });
    });
  }

  // ===========================
  // ORDER TOTAL
  // ===========================
  get previewTotal(): number {
    return this.previewProducts.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0
    );
  }
}