import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
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
  RotateCcw,
  StopCircle,
  BadgeCheck,
  Package
} from 'lucide-angular';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MrService } from '../../services/mr.service';

@Component({
  selector: 'app-mr-visit-dashboard',
  templateUrl: './mr-visit-dashboard.component.html',
  styleUrl: './mr-visit-dashboard.component.css'
})
export class MrVisitDashboardComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // Lucide Icons
  MapPin = MapPin;
  ClipboardList = ClipboardList;
  CalendarDays = CalendarDays;
  Filter = Filter;
  Eye = Eye;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  PlayCircle = PlayCircle;
  Navigation = Navigation;
  Flag = Flag;
  RotateCcw = RotateCcw;
  StopCircle = StopCircle;
  BadgeCheck = BadgeCheck;
  Package = Package;

  // User Info
  agencyId: number = Number(localStorage.getItem('aid'));
  mrId: number = Number(localStorage.getItem('mid'));
  areaManagerId: number = 0;

  // UI State
  loading = false;

  // Visit Data
  visits: any[] = [];

  // Customers Map
  customers: any[] = [];
  customerMap: { [key: number]: any } = {};

  // Pagination
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  totalRecords = 0;

  // Filters
  filters = {
    visitDate: '',
    status: ''
  };

  // Dashboard Counters
  assignedCount = 0;
  acceptedCount = 0;
  rejectedCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  todayCount = 0;
  todayProgress = 0;

  // Tracking State
  sessionId = 0;
  activeVisitPlanId = 0;
  currentLatitude = 0;
  currentLongitude = 0;
  currentIp = '';
  trackingTimer: any = null;

  // Modal States
  selectedVisit: any = null;
  selectedPlace: any = null;
  showViewModal: boolean = false;

  // Map Instance
  trackingData: any = null;
  map!: L.Map;
  routeLayer!: L.Polyline;

  constructor(
    private mrService: MrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
    this.checkTodayStartedVisit();
  }

  loadInitialData(): void {
    this.loading = true;
    this.getAssignedAreaManager();
  }

  /**
   * Recovers active visit tracking session on app launch/refresh
   */
  checkTodayStartedVisit(): void {
    if (!this.agencyId || !this.mrId) return;

    this.mrService.get_today_started_visit(this.agencyId, this.mrId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const startedVisit = res?.data || res;

          if (startedVisit && startedVisit.sessionId && (startedVisit.status === 'InProgress' || startedVisit.status === 'In Progress')) {
            this.sessionId = startedVisit.sessionId;
            this.activeVisitPlanId = startedVisit.visitPlanId;
            localStorage.setItem('visitSessionId', this.sessionId.toString());

            this.startTracking();
          }
        },
        error: (err) => console.log('No active session found on initialization:', err)
      });
  }

  getAssignedAreaManager(): void {
    const params = { medicalRepresentativeId: this.mrId };

    this.mrService.get_assigned_area_manager(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.loading = false;
            Swal.fire('Error', 'Area Manager not assigned.', 'error');
            return;
          }

          this.areaManagerId = res.data.areaManagerId;
          this.loadCustomers();
        },
        error: () => {
          this.loading = false;
          Swal.fire('Error', 'Unable to fetch Area Manager.', 'error');
        }
      });
  }

  loadCustomers(): void {
    const params = {
      agencyId: this.agencyId,
      assignedAreaManager: this.areaManagerId
    };

    this.mrService.get_customers(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.loading = false;
            Swal.fire('Error', 'Unable to fetch customers.', 'error');
            return;
          }

          this.customers = res.data || [];
          this.customerMap = {};

          this.customers.forEach((customer: any) => {
            this.customerMap[customer.customerId] = customer;
          });

          this.loadVisits();
        },
        error: () => {
          this.loading = false;
          Swal.fire('Error', 'Unable to fetch customers.', 'error');
        }
      });
  }

  loadVisits(): void {
    this.loading = true;

    const payload = {
      agencyId: this.agencyId,
      mrId: this.mrId,
      areaManagerId: this.areaManagerId,
      mrName: null,
      mobile: null,
      email: null,
      visitDate: this.filters.visitDate === '' ? null : this.filters.visitDate,
      status: this.filters.status === '' ? null : this.filters.status,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.mrService.get_visit_plan(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loading = false;

          if (!res.success) {
            this.visits = [];
            this.totalRecords = 0;
            this.totalPages = 1;
            return;
          }

          this.visits = res.data || [];
          this.totalRecords = res.totalRecords;
          this.totalPages = res.totalPages;
          this.pageNumber = res.pageNumber;
          this.pageSize = res.pageSize;

          this.mapCustomerData();
          this.calculateDashboard();
        },
        error: () => {
          this.loading = false;
          Swal.fire('Error', 'Unable to fetch visits.', 'error');
        }
      });
  }

  mapCustomerData(): void {
    this.visits.forEach((visit: any) => {
      if (!visit.places || visit.places.length === 0) {
        visit.customerName = '-';
        visit.mobile = '-';
        visit.address = '-';
        return;
      }

      const firstPlace = visit.places[0];
      const customer = this.customerMap[firstPlace.customerId];

      if (!customer) {
        visit.customerName = '-';
        visit.mobile = '-';
        visit.address = '-';
        return;
      }

      visit.customerName = customer.name;
      visit.mobile = customer.mobile;
      visit.address = customer.region;
    });
  }

  calculateDashboard(): void {
    this.assignedCount = this.visits.filter((x: any) => x.status === 'Assigned').length;
    this.acceptedCount = this.visits.filter((x: any) => x.status === 'Accepted').length;
    this.rejectedCount = this.visits.filter((x: any) => x.status === 'Rejected').length;
    this.inProgressCount = this.visits.filter((x: any) => x.status === 'In Progress' || x.status === 'InProgress').length;
    this.completedCount = this.visits.filter((x: any) => x.status === 'Completed').length;

    const today = new Date().toISOString().split('T')[0];
    this.todayCount = this.visits.filter((x: any) =>
      x.visitDate && x.visitDate.substring(0, 10) === today
    ).length;

    this.todayProgress = this.todayCount === 0
      ? 0
      : Math.round((this.completedCount / this.todayCount) * 100);
  }

  // ======================================================
  // PRODUCT LOGIC HELPERS FOR VISIT LIST & DIALOGS
  // ======================================================

  /**
   * Sums all products across places in a given Visit Plan
   */
  getTotalProducts(visit: any): number {
    if (!visit || !visit.places || !Array.isArray(visit.places)) {
      return 0;
    }

    return visit.places.reduce((total: number, place: any) => {
      const productCount = place.products && Array.isArray(place.products) ? place.products.length : 0;
      return total + productCount;
    }, 0);
  }

  /**
   * Returns a comma-separated list of product names assigned to a Visit Plan
   */
  getVisitedProductNames(visit: any): string {
    if (!visit || !visit.places || !Array.isArray(visit.places)) return '-';

    const productNames: string[] = [];

    visit.places.forEach((place: any) => {
      if (place.products && Array.isArray(place.products)) {
        place.products.forEach((prod: any) => {
          if (prod.productName && !productNames.includes(prod.productName)) {
            productNames.push(prod.productName);
          }
        });
      }
    });

    return productNames.length > 0 ? productNames.join(', ') : '-';
  }

  // ======================================================
  // FILTERS & PAGINATION
  // ======================================================

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadVisits();
  }

  resetFilters(): void {
    this.filters = { visitDate: '', status: '' };
    this.pageNumber = 1;
    this.loadVisits();
  }

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
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Assigned': return 'bg-gray-100 text-gray-700';
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'InProgress':
      case 'In Progress': return 'bg-amber-100 text-amber-800 font-semibold';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-gray-300 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  canAccept(visit: any): boolean { return visit.status === 'Assigned'; }
  canReject(visit: any): boolean { return visit.status === 'Assigned'; }
  canStartVisit(visit: any): boolean { return visit.status === 'Accepted'; }
  isVisitInProgress(visit: any): boolean { return visit.status === 'InProgress' || visit.status === 'In Progress'; }
  isVisitCompleted(visit: any): boolean { return visit.status === 'Completed' || visit.status === 'completed' || visit.status === 'InProgress' || visit.status === 'In Progress'; }
  canRoute(visit: any): boolean {
    return visit.status === 'Accepted' || visit.status === 'InProgress' || visit.status === 'In Progress' || visit.status === 'Completed';
  }

  viewVisit(visit: any): void {
    this.selectedVisit = visit;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedVisit = null;
  }

  getCustomerName(customerId: number): string {
    return this.customerMap?.[customerId]?.name || '-';
  }

  // ======================================================
  // ACCEPT / REJECT VISIT
  // ======================================================

  acceptVisit(visit: any): void {
    Swal.fire({
      title: 'Accept Visit?',
      text: 'Do you want to accept this visit assignment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      confirmButtonText: 'Yes, Accept'
    }).then(result => {
      if (!result.isConfirmed) return;

      const payload = {
        visitPlanId: visit.visitPlanId,
        mrId: this.mrId,
        status: 'Accepted'
      };

      this.mrService.visit_accepted_by_mr(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            if (!res.success) {
              Swal.fire('Error', res.message, 'error');
              return;
            }
            Swal.fire('Accepted', res.message, 'success');
            this.loadVisits();
          },
          error: () => Swal.fire('Error', 'Unable to accept visit.', 'error')
        });
    });
  }

  rejectVisit(visit: any): void {
    Swal.fire({
      title: 'Reject Visit?',
      text: 'Are you sure you want to reject this visit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Reject'
    }).then(result => {
      if (!result.isConfirmed) return;

      const payload = {
        visitPlanId: visit.visitPlanId,
        mrId: this.mrId,
        status: 'Rejected'
      };

      this.mrService.visit_accepted_by_mr(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            if (!res.success) {
              Swal.fire('Error', res.message, 'error');
              return;
            }
            Swal.fire('Rejected', res.message, 'success');
            this.loadVisits();
          },
          error: () => Swal.fire('Error', 'Unable to reject visit.', 'error')
        });
    });
  }

  // ======================================================
  // START / RESTART TRACKING
  // ======================================================

  async startVisit(visit: any): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitDate = new Date(visit.visitDate);
    visitDate.setHours(0, 0, 0, 0);

    if (visitDate > today) {
      await Swal.fire({
        icon: 'warning',
        title: 'Future Scheduled Visit',
        text: 'You cannot start a visit scheduled for a future date.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Start Visit?',
      text: 'GPS tracking will be started and your location recorded.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Start Visit'
    });

    if (!result.isConfirmed) return;

    try {
      const location = await this.getCurrentLocation();

      this.currentLatitude = location.latitude;
      this.currentLongitude = location.longitude;
      this.currentIp = await this.getPublicIp();

      const payload = {
        visitPlanId: visit.visitPlanId,
        mrId: this.mrId,
        latitude: this.currentLatitude,
        longitude: this.currentLongitude,
        ipAddress: this.currentIp
      };

      this.mrService.start_visit(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            if (!res.success) {
              Swal.fire('Cannot Start Visit', res.message, 'error');
              return;
            }

            this.sessionId = res.sessionId;
            this.activeVisitPlanId = visit.visitPlanId;
            localStorage.setItem('visitSessionId', this.sessionId.toString());
            visit.status = 'In Progress';

            this.startTracking();

            Swal.fire({
              icon: 'success',
              title: 'Visit Started',
              text: 'Tracking has been activated.',
              timer: 1800,
              showConfirmButton: false
            });

            this.loadVisits();
          },
          error: (err) => {
            Swal.fire('Error', err?.error?.message || 'Failed to start visit.', 'error');
          }
        });

    } catch {
      Swal.fire('Location Required', 'Please enable GPS/Location permissions to start the visit.', 'warning');
    }
  }

  restartTracking(visitPlanId: number): void {
    this.mrService.get_active_session(visitPlanId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const activeSessionId = res?.sessionId || res?.data?.sessionId;

          if (activeSessionId) {
            this.sessionId = activeSessionId;
            this.activeVisitPlanId = visitPlanId;
            localStorage.setItem('visitSessionId', this.sessionId.toString());

            this.startTracking();

            Swal.fire({
              icon: 'info',
              title: 'Tracking Resumed',
              text: 'Background location tracking has been restarted.',
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            Swal.fire('Error', 'No active tracking session found.', 'error');
          }
        },
        error: () => Swal.fire('Error', 'Unable to fetch active session.', 'error')
      });
  }

  startTracking(): void {
    if (this.trackingTimer) {
      clearInterval(this.trackingTimer);
      this.trackingTimer = null;
    }

    this.trackVisit();

    this.trackingTimer = setInterval(() => {
      this.trackVisit();
    }, 60000);
  }

  async trackVisit(): Promise<void> {
    if (!this.sessionId) return;

    try {
      const location = await this.getCurrentLocation();
      const payload = {
        sessionId: this.sessionId,
        latitude: location.latitude,
        longitude: location.longitude,
        ipAddress: this.currentIp
      };

      this.mrService.track_visit(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => console.log('Location Ping Sent'),
          error: () => console.log('Location Ping Failed')
        });
    } catch {
      console.log('Unable to retrieve GPS coordinates for ping');
    }
  }

  stopTracking(): void {
    if (this.trackingTimer) {
      clearInterval(this.trackingTimer);
      this.trackingTimer = null;
    }
  }

  // ======================================================
  // END VISIT ACTION
  // ======================================================

  async endVisit(visit: any): Promise<void> {
    let targetSessionId = this.sessionId || Number(localStorage.getItem('visitSessionId'));

    if (!targetSessionId || targetSessionId <= 0) {
      try {
        const res: any = await this.mrService.get_active_session(visit.visitPlanId).toPromise();
        targetSessionId = res?.sessionId || res?.data?.sessionId;
      } catch {
        Swal.fire('Error', 'Could not retrieve active session to end visit.', 'error');
        return;
      }
    }

    if (!targetSessionId || targetSessionId <= 0) {
      Swal.fire('Error', 'Invalid Session ID. Cannot end visit.', 'error');
      return;
    }

    const confirm = await Swal.fire({
      title: 'End Visit Session?',
      text: 'Are you sure you want to end this visit session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, End Visit',
      confirmButtonColor: '#dc2626'
    });

    if (!confirm.isConfirmed) return;

    try {
      const location = await this.getCurrentLocation();
      this.currentLatitude = location.latitude;
      this.currentLongitude = location.longitude;
      this.currentIp = await this.getPublicIp();

      const payload = {
        sessionId: targetSessionId,
        latitude: this.currentLatitude,
        longitude: this.currentLongitude,
        ipAddress: this.currentIp
      };

      this.mrService.end_visit(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            if (!res.success) {
              Swal.fire({
                icon: 'warning',
                title: 'Cannot End Visit',
                text: res.message || 'Complete all customer places before ending visit.',
                confirmButtonText: 'OK'
              });
              return;
            }

            this.stopTracking();
            this.sessionId = 0;
            this.activeVisitPlanId = 0;
            localStorage.removeItem('visitSessionId');
            visit.status = 'Completed';

            Swal.fire({
              icon: 'success',
              title: 'Visit Ended Successfully',
              text: res.message,
              timer: 1800,
              showConfirmButton: false
            });

            this.loadVisits();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed to End Visit',
              text: err?.error?.message || 'Server error occurred.',
              confirmButtonText: 'OK'
            });
          }
        });

    } catch {
      Swal.fire('Location Required', 'GPS access is required to end the visit.', 'warning');
    }
  }

  // ======================================================
  // COMPLETE VISIT FOR A PLACE (MATCHES PAYLOAD SCHEME)
  // ======================================================

  openCompleteForPlace(visit: any, place: any): void {
    this.selectedVisit = visit;
    this.selectedPlace = place;

    Swal.fire({
      title: 'Complete Place Visit',
      html: `
        <p style="font-size:13px; color:#666; margin-bottom:10px;">
          Enter visit feedback/remarks for <b>${this.getCustomerName(place.customerId)}</b>:
        </p>
        <textarea
          id="visitRemarks"
          class="swal2-textarea"
          placeholder="Enter detailed visit remarks..."
          style="height:110px; font-size:14px; margin:0; width:100%; box-sizing:border-box;"></textarea>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Submit & Complete',
      confirmButtonColor: '#16a34a',
      preConfirm: () => {
        const remarks = (document.getElementById('visitRemarks') as HTMLTextAreaElement).value.trim();
        if (!remarks) {
          Swal.showValidationMessage('Visit remarks are required.');
          return false;
        }
        return remarks;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeCompleteVisit(result.value);
      }
    });
  }

  async executeCompleteVisit(remarks: string): Promise<void> {
    if (!this.selectedVisit || !this.selectedPlace) return;

    try {
      const location = await this.getCurrentLocation();

      // Collect product IDs checked off in the modal
      const shownProductIds: number[] = (this.selectedPlace.products || [])
        .filter((product: any) => product.showProduct === true)
        .map((product: any) => Number(product.productId));

      // EXACT COMPLETE_VISIT PAYLOAD SCHEME
      const payload = {
        visitPlanId: Number(this.selectedVisit.visitPlanId),
        visitPlanDetailId: Number(this.selectedPlace.visitPlanDetailId),
        currentLatitude: Number(location.latitude),
        currentLongitude: Number(location.longitude),
        visitRemarks: remarks,
        shownProductIds: shownProductIds
      };

      console.log('Complete Visit Payload:', payload);

      this.mrService.complete_visit(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            if (!res.success) {
              Swal.fire('Error', res.message || 'Failed to complete place visit.', 'error');
              return;
            }

            this.selectedPlace.status = 'Completed';

            const allCompleted = this.selectedVisit.places.every(
              (p: any) => p.status === 'Completed'
            );
            if (allCompleted) {
              this.selectedVisit.status = 'Completed';
            }

            Swal.fire({
              icon: 'success',
              title: 'Place Visit Completed',
              text: res.message || 'Location completed successfully!',
              timer: 1800,
              showConfirmButton: false
            });

            this.loadVisits();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err?.error?.message || 'Server error occurred while completing visit.'
            });
          }
        });

    } catch {
      Swal.fire({
        icon: 'warning',
        title: 'Location Required',
        text: 'Please enable GPS permissions to record location upon completing visit.'
      });
    }
  }

  // ======================================================
  // ROUTE MAP DISPLAY
  // ======================================================

  showTracking(visit: any): void {
    this.mrService.get_tracking_of_mr(visit.visitPlanId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            Swal.fire('Error', res.message, 'error');
            return;
          }

          this.trackingData = res.data;
          this.openTrackingMap();
        },
        error: () => Swal.fire('Error', 'Unable to fetch tracking data.', 'error')
      });
  }

  openTrackingMap(): void {
    Swal.fire({
      title: 'MR Route & GPS History',
      width: '90%',
      html: `<div id="trackingMap" style="height:550px; border-radius:12px;"></div>`,
      showConfirmButton: true,
      confirmButtonText: 'Close Map',
      didOpen: () => {
        setTimeout(() => this.loadTrackingMap(), 300);
      }
    });
  }

  loadTrackingMap(): void {
    if (!this.trackingData || !this.trackingData.session) return;

    const session = this.trackingData.session;

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('trackingMap');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const routeCoordinates: L.LatLngExpression[] = [];

    if (session.startLatitude != null && session.startLongitude != null) {
      const startLatLng: L.LatLngExpression = [session.startLatitude, session.startLongitude];
      routeCoordinates.push(startLatLng);

      L.marker(startLatLng)
        .addTo(this.map)
        .bindPopup(`<b>Visit Started</b><br>Time: ${new Date(session.startTime).toLocaleString()}`);
    }

    if (session.trackingPoints && session.trackingPoints.length > 0) {
      session.trackingPoints.forEach((point: any, index: number) => {
        const latLng: L.LatLngExpression = [point.latitude, point.longitude];
        routeCoordinates.push(latLng);

        L.circleMarker(latLng, {
          radius: 6,
          color: '#2563eb',
          fillColor: '#3b82f6',
          fillOpacity: 1,
          weight: 2
        })
          .addTo(this.map)
          .bindPopup(`<b>Point ${index + 1}</b><br>Time: ${new Date(point.trackedAt).toLocaleString()}`);
      });
    }

    if (session.endLatitude != null && session.endLongitude != null) {
      const endLatLng: L.LatLngExpression = [session.endLatitude, session.endLongitude];
      routeCoordinates.push(endLatLng);

      L.marker(endLatLng)
        .addTo(this.map)
        .bindPopup(`<b>Visit Ended</b><br>Time: ${new Date(session.endTime).toLocaleString()}`);
    } else if (routeCoordinates.length > 0) {
      const lastPoint = routeCoordinates[routeCoordinates.length - 1];
      L.marker(lastPoint).addTo(this.map).bindPopup(`<b>Current Location</b>`);
    }

    if (routeCoordinates.length > 1) {
      this.routeLayer = L.polyline(routeCoordinates, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.8
      }).addTo(this.map);

      this.map.fitBounds(this.routeLayer.getBounds(), { padding: [40, 40] });
    } else if (routeCoordinates.length === 1) {
      this.map.setView(routeCoordinates[0] as L.LatLngExpression, 16);
    }
  }

  getCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  async getPublicIp(): Promise<string> {
    try {
      const response: any = await this.http.get('https://api.ipify.org?format=json').toPromise();
      return response.ip;
    } catch {
      return '';
    }
  }

  ngOnDestroy(): void {
    this.stopTracking();
    this.destroy$.next();
    this.destroy$.complete();
  }
}