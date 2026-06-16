import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  MapPin,
  ClipboardList,
  CalendarDays,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  PlayCircle,
  Navigation,
  Flag,
  BadgeCheck
} from 'lucide-angular';

@Component({
  selector: 'app-mr-visit-dashboard',
  templateUrl: './mr-visit-dashboard.component.html',
  styleUrl: './mr-visit-dashboard.component.css'
})
export class MrVisitDashboardComponent implements OnInit {

  // Icons

  readonly MapPin = MapPin;
  readonly ClipboardList = ClipboardList;
  readonly CalendarDays = CalendarDays;
  readonly Filter = Filter;
  readonly Eye = Eye;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly PlayCircle = PlayCircle;
  readonly Navigation = Navigation;
  readonly Flag = Flag;
  readonly BadgeCheck = BadgeCheck;

  loading = false;

  visits: any[] = [];

  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  totalRecords = 0;

  filters = {
    visitDate: '',
    status: ''
  };

  assignedCount = 0;
  acceptedCount = 0;
  rejectedCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  todayCount = 0;
  todayProgress = 0;

  constructor() { }

  ngOnInit(): void {
    this.loadVisits();
  }

  loadVisits(): void {

    this.loading = true;

    setTimeout(() => {

      this.visits = [

        {
          visitId: 1,
          visitDate: '2026-06-18',
          customerName: 'Apollo Pharmacy',
          customerType: 'Retailer',
          address: 'Salt Lake, Kolkata',
          mobile: '9876543210',
          remarks: 'Need product discussion',
          status: 'Assigned',
          latitude: 22.5726,
          longitude: 88.3639,
          places: [{}, {}],
          products: [{}, {}, {}]
        },

        {
          visitId: 2,
          visitDate: '2026-06-18',
          customerName: 'Life Care Hospital',
          customerType: 'Hospital',
          address: 'New Town, Kolkata',
          mobile: '9123456789',
          remarks: 'Collect order',
          status: 'Accepted',
          latitude: 22.5805,
          longitude: 88.4587,
          places: [{}],
          products: [{}, {}]
        },

        {
          visitId: 3,
          visitDate: '2026-06-18',
          customerName: 'Dr. Amit Sharma',
          customerType: 'Doctor',
          address: 'Howrah',
          mobile: '9000000000',
          remarks: 'Follow up visit',
          status: 'In Progress',
          latitude: 22.5958,
          longitude: 88.2636,
          places: [{}, {}, {}],
          products: [{}, {}, {}, {}]
        },

        {
          visitId: 4,
          visitDate: '2026-06-18',
          customerName: 'City Medical',
          customerType: 'Retailer',
          address: 'Park Street',
          mobile: '9988776655',
          remarks: 'Completed Successfully',
          status: 'Completed',
          latitude: 22.5522,
          longitude: 88.3520,
          places: [{}],
          products: [{}]
        }

      ];

      this.totalRecords = this.visits.length;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

      this.calculateDashboard();

      this.loading = false;

    }, 800);

  }

  calculateDashboard(): void {

    this.assignedCount = this.visits.filter(x => x.status === 'Assigned').length;

    this.acceptedCount = this.visits.filter(x => x.status === 'Accepted').length;

    this.rejectedCount = this.visits.filter(x => x.status === 'Rejected').length;

    this.inProgressCount = this.visits.filter(x => x.status === 'In Progress').length;

    this.completedCount = this.visits.filter(x => x.status === 'Completed').length;

    const today = new Date().toISOString().split('T')[0];

    this.todayCount = this.visits.filter(x => x.visitDate === today).length;

    this.todayProgress =
      this.todayCount === 0
        ? 0
        : Math.round((this.completedCount / this.todayCount) * 100);

  }

  // ======================================================
  // FILTERS
  // ======================================================

  applyFilters(): void {

    console.log('Filters Applied', this.filters);

    // TODO:
    // Call API with filters

  }

  resetFilters(): void {

    this.filters = {

      visitDate: '',

      status: ''

    };

    this.pageNumber = 1;

    this.loadVisits();

  }

  // ======================================================
  // PAGINATION
  // ======================================================

  previousPage(): void {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.loadVisits();

    }

  }

  nextPage(): void {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.loadVisits();

    }

  }

  goToPage(page: number): void {

    this.pageNumber = page;

    this.loadVisits();

  }

  getPageNumbers(): number[] {

    const pages: number[] = [];

    for (let i = 1; i <= this.totalPages; i++) {

      pages.push(i);

    }

    return pages;

  }

  // ======================================================
  // STATUS BADGE
  // ======================================================

  getStatusClass(status: string): string {

    switch (status) {

      case 'Assigned':
        return 'bg-gray-100 text-gray-700';

      case 'Accepted':
        return 'bg-green-100 text-green-700';

      case 'Rejected':
        return 'bg-red-100 text-red-700';

      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';

      case 'Completed':
        return 'bg-blue-100 text-blue-700';

      case 'Cancelled':
        return 'bg-gray-300 text-gray-700';

      default:
        return 'bg-gray-100 text-gray-700';

    }

  }

  // ======================================================
  // TOTAL PRODUCTS
  // ======================================================

  getTotalProducts(visit: any): number {

    if (!visit.products) {

      return 0;

    }

    return visit.products.length;

  }

  // ======================================================
  // BUTTON VISIBILITY
  // ======================================================

  canAccept(visit: any): boolean {

    return visit.status === 'Assigned';

  }

  canReject(visit: any): boolean {

    return visit.status === 'Assigned';

  }

  canStartVisit(visit: any): boolean {

    return visit.status === 'Accepted';

  }

  canRoute(visit: any): boolean {

    return visit.status === 'Accepted'
      || visit.status === 'In Progress';

  }

  canEndVisit(visit: any): boolean {

    return visit.status === 'In Progress';

  }

  // ======================================================
  // VIEW VISIT
  // ======================================================

  viewVisit(visit: any): void {

    Swal.fire({

      title: 'Visit Details',

      html: `
      <div style="text-align:left">

        <p><b>Customer :</b> ${visit.customerName}</p>

        <p><b>Customer Type :</b> ${visit.customerType}</p>

        <p><b>Visit Date :</b> ${visit.visitDate}</p>

        <p><b>Address :</b> ${visit.address}</p>

        <p><b>Mobile :</b> ${visit.mobile}</p>

        <p><b>Status :</b> ${visit.status}</p>

        <p><b>Remarks :</b> ${visit.remarks || '-'}</p>

      </div>
    `,

      width: 650,

      confirmButtonText: 'Close'

    });

  }

  // ======================================================
  // ACCEPT VISIT
  // ======================================================

  acceptVisit(visit: any): void {

    Swal.fire({

      title: 'Accept Visit?',

      text: 'Do you want to accept this visit?',

      icon: 'question',

      showCancelButton: true,

      confirmButtonColor: '#16a34a',

      confirmButtonText: 'Accept'

    }).then(result => {

      if (!result.isConfirmed) {

        return;

      }

      visit.status = 'Accepted';

      this.calculateDashboard();

      Swal.fire(

        'Accepted',

        'Visit accepted successfully.',

        'success'

      );

    });

  }

  // ======================================================
  // REJECT VISIT
  // ======================================================

  rejectVisit(visit: any): void {

    Swal.fire({

      title: 'Reject Visit?',

      text: 'Are you sure?',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor: '#dc2626',

      confirmButtonText: 'Reject'

    }).then(result => {

      if (!result.isConfirmed) {

        return;

      }

      visit.status = 'Rejected';

      this.calculateDashboard();

      Swal.fire(

        'Rejected',

        'Visit rejected successfully.',

        'success'

      );

    });

  }

  // ======================================================
  // START VISIT
  // ======================================================

  startVisit(visit: any): void {

    Swal.fire({

      title: 'Start Visit?',

      text: 'Your visit will now start.',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Start'

    }).then(result => {

      if (!result.isConfirmed) {

        return;

      }

      visit.status = 'In Progress';

      this.calculateDashboard();

      Swal.fire(

        'Started',

        'Visit started successfully.',

        'success'

      );

    });

  }

  // ======================================================
  // END VISIT
  // ======================================================

  endVisit(visit: any): void {

    Swal.fire({

      title: 'End Visit?',

      text: 'Do you want to complete this visit?',

      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Complete'

    }).then(result => {

      if (!result.isConfirmed) {

        return;

      }

      visit.status = 'Completed';

      this.calculateDashboard();

      Swal.fire(

        'Completed',

        'Visit completed successfully.',

        'success'

      );

    });

  }

  // ======================================================
  // ROUTE
  // ======================================================

  openRoute(visit: any): void {

    if (!visit.latitude || !visit.longitude) {

      Swal.fire(

        'Location Missing',

        'Latitude or Longitude is not available.',

        'warning'

      );

      return;

    }

    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${visit.latitude},${visit.longitude}`;

    window.open(url, '_blank');

  }

}

