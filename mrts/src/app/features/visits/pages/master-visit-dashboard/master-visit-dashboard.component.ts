import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import {
  MapPin,
  Plus,
  Map,
  ShoppingCart,
  DollarSign,
  Users,
  Eye,
  Edit,
  XCircle,
  Save,
  Package,
  User,
  Calendar,
  Clock,
  Trash2,
  Navigation,
  Flag,
  BadgeCheck

} from 'lucide-angular';
import { VisitService } from '../../services/visit.service';

@Component({
  selector: 'app-master-visit-dashboard',
  templateUrl: './master-visit-dashboard.component.html',
  styleUrl: './master-visit-dashboard.component.css'
})
export class MasterVisitDashboardComponent implements OnInit {

  // Icons
  MapPin = MapPin;
  Plus = Plus;
  Map = Map;
  ShoppingCart = ShoppingCart;
  DollarSign = DollarSign;
  Users = Users;
  Eye = Eye;
  Edit = Edit;
  XCircle = XCircle;
  Save = Save;
  Package = Package;
  User = User;
  Calendar = Calendar;
  Clock = Clock;
  Trash2 = Trash2;
  Navigation = Navigation;
  Flag = Flag;
  BadgeCheck = BadgeCheck;

  // =========================
  // Dashboard Data
  // =========================

  visits: any[] = [];
  totalRecords = 0;
  totalPages = 0;
  pageNumber = 1;
  pageSize = 10;

  loading = false;

  // =========================
  // Filters
  // =========================

  filters = {
    mrName: '',
    visitDate: '',
    status: ''
  };

  // =========================
  // View Modal
  // =========================

  showViewModal = false;
  selectedVisit: any = null;

  // =========================
  // Edit Modal
  // =========================

  showEditModal = false;
  editVisit: any = null;

  // =========================
  // Product Modal
  // =========================

  showProductModal = false;

  currentPlaceIndex = -1;

  selectedProducts: any[] = [];

  // =========================
  // Dropdowns
  // =========================

  mrList: any[] = [];
  customerList: any[] = [];
  products: any[] = [];

  // =========================
  // Product Search
  // =========================

  productSearch = {
    name: '',
    brandName: ''
  };

  loadingProducts = false;

  trackingTimer: any;

  trackingData: any = null;

  map!: L.Map;

  routeLayer!: L.Polyline;


  constructor(
    private visitService: VisitService
  ) { }

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadMRs();

    this.loadCustomers();

    this.loadVisits();

  }

  // =========================
  // LOAD VISITS
  // =========================

  loadVisits(): void {

    this.loading = true;

    const payload = {

      agencyId:
        Number(localStorage.getItem('aid')),

      mrId: null,

      areaManagerId:
        Number(localStorage.getItem('mid')),

      mrName:
        this.filters.mrName || null,

      mobile: null,

      email: null,

      visitDate:
        this.filters.visitDate || null,

      status:
        this.filters.status || null,

      pageNumber:
        this.pageNumber,

      pageSize:
        this.pageSize

    };

    this.visitService
      .get_visit_plan(payload)
      .subscribe({

        next: (res: any) => {

          this.visits =
            res?.data || [];

          this.totalRecords =
            res?.totalRecords || 0;

          this.totalPages =
            res?.totalPages || 0;

          this.loading = false;

        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;

          Swal.fire(
            'Error',
            'Failed to load visits',
            'error'
          );

        }

      });

  }

  // =========================
  // FILTER
  // =========================

  applyFilters(): void {

    this.pageNumber = 1;

    this.loadVisits();

  }

  resetFilters(): void {

    this.filters = {
      mrName: '',
      visitDate: '',
      status: ''
    };

    this.pageNumber = 1;

    this.loadVisits();

  }

  // =========================
  // PAGINATION
  // =========================

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

    for (
      let i = 1;
      i <= this.totalPages;
      i++
    ) {
      pages.push(i);
    }

    return pages;

  }

  // =========================
  // LOAD MRS
  // =========================

  loadMRs(): void {

    const payload = {
      assignedAreaManager: Number(localStorage.getItem('mid')),
      agencyId: Number(localStorage.getItem('aid')),
    };

    this.visitService
      .get_mrs(payload)
      .subscribe({

        next: (res: any) => {

          this.mrList =
            res?.data || [];

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  canRoute(visit: any): boolean {

    return visit.status === 'Accepted'
      || visit.status === 'InProgress'
      || visit.status === 'Completed';

  }

  showTracking(visit: any): void {
  
      this.visitService
        .get_tracking_of_mr(visit.visitPlanId)
        .subscribe({
  
          next: (res: any) => {
  
            if (!res.success) {
  
              Swal.fire(
                'Error',
                res.message,
                'error'
              );
  
              return;
  
            }
  
            this.trackingData = res.data;
  
            this.openTrackingMap();
  
          },
  
          error: () => {
  
            Swal.fire(
              'Error',
              'Unable to fetch tracking.',
              'error'
            );
  
          }
  
        });
  
    }
  
    openTrackingMap(): void {
  
      Swal.fire({
  
        title: 'MR Route',
  
        width: '90%',
  
        html: `
  
          <div id="trackingMap"
               style="height:600px;border-radius:12px;"></div>
  
      `,
  
        showConfirmButton: true,
  
        confirmButtonText: 'Close',
  
        didOpen: () => {
  
          setTimeout(() => {
  
            this.loadTrackingMap();
  
          }, 300);
  
        }
  
      });
  
    }
  
  
    loadTrackingMap(): void {
  
      if (!this.trackingData || !this.trackingData.session) {
        return;
      }
  
      const session = this.trackingData.session;
  
      // Destroy previous map
      if (this.map) {
        this.map.remove();
      }
  
      // Create map
      this.map = L.map('trackingMap');
  
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }
      ).addTo(this.map);
  
      const routeCoordinates: L.LatLngExpression[] = [];
  
      // -------------------------------
      // START MARKER
      // -------------------------------
  
      if (
        session.startLatitude != null &&
        session.startLongitude != null
      ) {
  
        const startLatLng: L.LatLngExpression = [
          session.startLatitude,
          session.startLongitude
        ];
  
        routeCoordinates.push(startLatLng);
  
        L.marker(startLatLng)
          .addTo(this.map)
          .bindPopup(`
          <b>Visit Started</b><br>
          Time :
          ${new Date(session.startTime).toLocaleString()}
        `);
  
      }
  
      // -------------------------------
      // TRACKING POINTS
      // -------------------------------
  
      if (
        session.trackingPoints &&
        session.trackingPoints.length > 0
      ) {
  
        session.trackingPoints.forEach(
          (point: any, index: number) => {
  
            const latLng: L.LatLngExpression = [
              point.latitude,
              point.longitude
            ];
  
            routeCoordinates.push(latLng);
  
            L.circleMarker(latLng, {
  
              radius: 6,
  
              color: '#2563eb',
  
              fillColor: '#3b82f6',
  
              fillOpacity: 1,
  
              weight: 2
  
            })
              .addTo(this.map)
              .bindPopup(`
              <b>Tracking Point ${index + 1}</b><br>
              Time :
              ${new Date(point.trackedAt).toLocaleString()}
            `);
  
          });
  
      }
  
      // -------------------------------
      // END MARKER
      // -------------------------------
  
      if (
        session.endLatitude != null &&
        session.endLongitude != null
      ) {
  
        const endLatLng: L.LatLngExpression = [
          session.endLatitude,
          session.endLongitude
        ];
  
        routeCoordinates.push(endLatLng);
  
        L.marker(endLatLng)
          .addTo(this.map)
          .bindPopup(`
          <b>Visit Ended</b><br>
          Time :
          ${new Date(session.endTime).toLocaleString()}
        `);
  
      }
  
      else if (routeCoordinates.length > 0) {
  
        const lastPoint =
          routeCoordinates[routeCoordinates.length - 1];
  
        L.marker(lastPoint)
          .addTo(this.map)
          .bindPopup(`
          <b>Current Position</b>
        `);
  
      }
  
      // -------------------------------
      // ROUTE LINE
      // -------------------------------
  
      if (routeCoordinates.length > 1) {
  
        this.routeLayer = L.polyline(
          routeCoordinates,
          {
            color: '#2563eb',
            weight: 5,
            opacity: 0.8
          }
        ).addTo(this.map);
  
        this.map.fitBounds(
          this.routeLayer.getBounds(),
          {
            padding: [40, 40]
          }
        );
  
      }
  
      else if (routeCoordinates.length === 1) {
  
        this.map.setView(routeCoordinates[0] as L.LatLngExpression, 16);
  
      }
  
    }

  // =========================
  // LOAD CUSTOMERS
  // =========================

  loadCustomers(): void {

    const payload = {
      assignedAreaManager: Number(localStorage.getItem('mid')),
      agencyId: Number(localStorage.getItem('aid')),

    };

    this.visitService
      .get_customers(payload)
      .subscribe({

        next: (res: any) => {

          this.customerList =
            res?.data || [];

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  // =========================
  // VIEW VISIT
  // =========================

  openViewModal(
    visit: any
  ): void {

    this.selectedVisit = visit;

    this.showViewModal = true;

  }

  closeViewModal(): void {

    this.selectedVisit = null;

    this.showViewModal = false;

  }

  // =========================
  // HELPERS
  // =========================

  getCustomerName(
    customerId: number
  ): string {

    const customer =
      this.customerList.find(
        (x: any) =>
          x.customerId === customerId
      );

    return (
      customer?.name ||
      'Unknown Customer'
    );

  }

  getTotalProducts(
    visit: any
  ): number {

    let count = 0;

    visit?.places?.forEach(
      (place: any) => {

        count +=
          place?.products?.length || 0;

      }
    );

    return count;

  }

  canEdit(
    visit: any
  ): boolean {

    return (
      visit?.status === 'Assigned'
    );

  }

  canCancel(
    visit: any
  ): boolean {

    return (
      visit?.status === 'Assigned'
    );

  }

  // =========================
  // EDIT VISIT
  // =========================

  openEditModal(visit: any): void {

    this.editVisit = {
      visitPlanId: visit.visitPlanId,
      mrId: visit.mrId,
      visitDate: visit.visitDate
        ? visit.visitDate.split('T')[0]
        : '',
      remarks: visit.remarks,
      places: visit.places.map((place: any) => ({
        visitPlanDetailId:
          place.visitPlanDetailId,

        customerId:
          place.customerId,

        doctorId:
          place.doctorId,

        plannedTime:
          place.plannedTime,

        sequenceNo:
          place.sequenceNo,

        remarks:
          place.remarks || '',

        productIds:
          place.products.map(
            (p: any) => p.productId
          ),

        selectedProducts:
          [...place.products]
      }))
    };

    this.showEditModal = true;

  }

  closeEditModal(): void {

    this.editVisit = null;

    this.showEditModal = false;

  }

  // =========================
  // CUSTOMER VISITS
  // =========================

  addPlace(): void {

    if (!this.editVisit) return;

    this.editVisit.places.push({

      customerId: null,

      doctorId: null,

      plannedTime: '',

      sequenceNo:
        this.editVisit.places.length + 1,

      remarks: '',

      productIds: [],

      selectedProducts: []

    });

  }

  removePlace(
    index: number
  ): void {

    Swal.fire({

      title:
        'Remove Customer Visit?',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText:
        'Remove'

    }).then((result) => {

      if (result.isConfirmed) {

        this.editVisit.places.splice(
          index,
          1
        );

      }

    });

  }

  // =========================
  // PRODUCT MODAL
  // =========================

  openProductModal(
    placeIndex: number
  ): void {

    this.currentPlaceIndex =
      placeIndex;

    this.selectedProducts =
      [
        ...(
          this.editVisit
            .places[placeIndex]
            .selectedProducts || []
        )
      ];

    this.showProductModal = true;

    this.loadProducts();

  }

  closeProductModal(): void {

    this.showProductModal = false;

    this.currentPlaceIndex = -1;

    this.selectedProducts = [];

  }

  // =========================
  // LOAD PRODUCTS
  // =========================

  loadProducts(): void {

    this.loadingProducts = true;

    const params = {

      AgencyId:
        Number(
          localStorage.getItem('aid')
        ),

      Name:
        this.productSearch.name,

      BrandName:
        this.productSearch.brandName,

      PageNumber: 1,

      PageSize: 50

    };

    this.visitService
      .getproductdetails(params)
      .subscribe({

        next: (res: any) => {

          this.products =
            res?.data || [];

          this.loadingProducts =
            false;

        },

        error: (err: any) => {

          console.error(err);

          this.loadingProducts =
            false;

        }

      });

  }

  searchProducts(): void {

    this.loadProducts();

  }

  clearProductSearch(): void {

    this.productSearch = {
      name: '',
      brandName: ''
    };

    this.loadProducts();

  }

  // =========================
  // PRODUCT SELECTION
  // =========================

  toggleProduct(
    product: any
  ): void {

    const index =
      this.selectedProducts.findIndex(
        (x: any) =>
          x.productId ===
          product.productId
      );

    if (index > -1) {

      this.selectedProducts.splice(
        index,
        1
      );

    } else {

      this.selectedProducts.push(
        product
      );

    }

  }

  isSelected(
    productId: number
  ): boolean {

    return this.selectedProducts.some(
      (x: any) =>
        x.productId === productId
    );

  }

  saveProducts(): void {

    if (
      this.currentPlaceIndex < 0
    ) {
      return;
    }

    this.editVisit
      .places[
      this.currentPlaceIndex
    ]
      .selectedProducts =
      [...this.selectedProducts];

    this.editVisit
      .places[
      this.currentPlaceIndex
    ]
      .productIds =
      this.selectedProducts.map(
        (x: any) =>
          x.productId
      );

    this.closeProductModal();

  }

  // =========================
  // UPDATE VISIT
  // =========================

  updateVisit(): void {

    if (!this.editVisit.mrId) {

      Swal.fire(
        'Validation',
        'Select MR',
        'warning'
      );

      return;

    }

    if (
      !this.editVisit.visitDate
    ) {

      Swal.fire(
        'Validation',
        'Select Visit Date',
        'warning'
      );

      return;

    }

    const payload = {

      visitPlanId:
        this.editVisit
          .visitPlanId,

      mrId:
        this.editVisit.mrId,

      visitDate:
        this.editVisit
          .visitDate,

      remarks:
        this.editVisit
          .remarks,

      updatedBy:
        Number(
          localStorage.getItem('mid')
        ),

      places:
        this.editVisit.places.map(
          (place: any) => ({

            customerId:
              place.customerId,

            doctorId:
              null,

            plannedTime:
              place.plannedTime,

            sequenceNo:
              Number(
                place.sequenceNo
              ),

            remarks:
              place.remarks,

            productIds:
              place.productIds

          })
        )

    };

    this.visitService
      .update_visit(payload)
      .subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text:
              'Visit Updated Successfully'
          });

          this.closeEditModal();

          this.loadVisits();

        },

        error: (err: any) => {

          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.message ||
              'Failed to update visit'
          });

        }

      });

  }

  // =========================
  // CANCEL VISIT
  // =========================

  cancelVisit(
    visit: any
  ): void {

    Swal.fire({

      title:
        'Cancel Visit?',

      text:
        'This action cannot be undone.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonColor:
        '#dc2626',

      confirmButtonText:
        'Yes, Cancel'

    }).then((result) => {

      if (
        !result.isConfirmed
      ) {
        return;
      }

      const payload = {

        visitPlanId:
          visit.visitPlanId,

        updatedBy:
          Number(
            localStorage.getItem('mid')
          )

      };

      this.visitService
        .cancel_visit(payload)
        .subscribe({

          next: () => {

            Swal.fire({

              icon: 'success',

              title:
                'Cancelled',

              text:
                'Visit cancelled successfully'

            });

            this.loadVisits();

          },

          error: (err: any) => {

            console.error(err);

            Swal.fire({

              icon: 'error',

              title:
                'Error',

              text:
                err?.error?.message ||
                'Failed to cancel visit'

            });

          }

        });

    });

  }

  // =========================
  // STATUS CLASS
  // =========================

  getStatusClass(
    status: string
  ): string {

    switch (
    status?.toLowerCase()
    ) {

      case 'completed':
        return 'bg-green-100 text-green-700';

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      case 'assigned':
        return 'bg-blue-100 text-blue-700';

      default:
        return 'bg-gray-100 text-gray-700';

    }

  }

}