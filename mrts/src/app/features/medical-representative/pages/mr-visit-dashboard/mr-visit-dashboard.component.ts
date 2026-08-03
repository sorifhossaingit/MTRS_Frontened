// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import Swal from 'sweetalert2';
// import * as L from 'leaflet';
// import {
//   MapPin,
//   ClipboardList,
//   CalendarDays,
//   Filter,
//   Eye,
//   CheckCircle,
//   XCircle,
//   PlayCircle,
//   Navigation,
//   Flag,
//   BadgeCheck
// } from 'lucide-angular';

// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { MrService } from '../../services/mr.service';

// @Component({
//   selector: 'app-mr-visit-dashboard',
//   templateUrl: './mr-visit-dashboard.component.html',
//   styleUrl: './mr-visit-dashboard.component.css'
// })
// export class MrVisitDashboardComponent implements OnInit, OnDestroy {

//   private destroy$ = new Subject<void>();

//   // Icons

//   MapPin = MapPin;
//   ClipboardList = ClipboardList;
//   CalendarDays = CalendarDays;
//   Filter = Filter;
//   Eye = Eye;
//   CheckCircle = CheckCircle;
//   XCircle = XCircle;
//   PlayCircle = PlayCircle;
//   Navigation = Navigation;
//   Flag = Flag;
//   BadgeCheck = BadgeCheck;

//   // Logged-in User
//   agencyId: number = Number(localStorage.getItem('aid'));
//   mrId: number = Number(localStorage.getItem('mid'));
//   areaManagerId: number = 0;

//   // Loading
//   loading = false;

//   // Visit Data
//   visits: any[] = [];

//   // Customers
//   customers: any[] = [];
//   customerMap: { [key: number]: any } = {};

//   // Pagination
//   pageNumber = 1;
//   pageSize = 10;
//   totalPages = 1;
//   totalRecords = 0;

//   // Filters
//   filters = {
//     visitDate: '',
//     status: ''
//   };

//   // Dashboard
//   assignedCount = 0;
//   acceptedCount = 0;
//   rejectedCount = 0;
//   inProgressCount = 0;
//   completedCount = 0;
//   todayCount = 0;
//   todayProgress = 0;

//   // Tracking (used in later steps)
//   sessionId = 0;
//   trackingInterval: any;
//   currentLatitude = 0;
//   currentLongitude = 0;
//   currentIp = '';

//   // Complete Visit (used in later steps)
//   selectedVisit: any = null;
//   visitRemarks = '';
//   selectedProductIds: number[] = [];

//   showViewModal: boolean = false;

//   selectedPlace: any = null;

//   trackingTimer: any;

//   trackingData: any = null;

//   map!: L.Map;

//   routeLayer!: L.Polyline;

//   constructor(
//     private mrService: MrService,
//     private http: HttpClient
//   ) { }

//   ngOnInit(): void {

//     this.loadInitialData();

//   }

//   loadInitialData(): void {

//     this.loading = true;

//     this.getAssignedAreaManager();

//   }

//   getAssignedAreaManager(): void {

//     const params = {

//       medicalRepresentativeId: this.mrId

//     };

//     this.mrService.get_assigned_area_manager(params)
//       .subscribe({

//         next: (res: any) => {

//           if (!res.success) {

//             this.loading = false;

//             Swal.fire(
//               'Error',
//               'Area Manager not assigned.',
//               'error'
//             );

//             return;

//           }

//           this.areaManagerId = res.data.areaManagerId;

//           this.loadCustomers();

//         },

//         error: () => {

//           this.loading = false;

//           Swal.fire(
//             'Error',
//             'Unable to fetch Area Manager.',
//             'error'
//           );

//         }

//       });

//   }

//   loadCustomers(): void {

//     const params = {

//       agencyId: this.agencyId,

//       assignedAreaManager: this.areaManagerId

//     };

//     this.mrService.get_customers(params)
//       .subscribe({

//         next: (res: any) => {

//           if (!res.success) {

//             this.loading = false;

//             Swal.fire(
//               'Error',
//               'Unable to fetch customers.',
//               'error'
//             );

//             return;

//           }

//           this.customers = res.data || [];

//           this.customerMap = {};

//           this.customers.forEach((customer: any) => {

//             this.customerMap[customer.customerId] = customer;

//           });

//           this.loadVisits();

//         },

//         error: () => {

//           this.loading = false;

//           Swal.fire(
//             'Error',
//             'Unable to fetch customers.',
//             'error'
//           );

//         }

//       });

//   }

//   loadVisits(): void {

//     this.loading = true;

//     const payload = {

//       agencyId: this.agencyId,

//       mrId: this.mrId,

//       areaManagerId: this.areaManagerId,

//       mrName: null,

//       mobile: null,

//       email: null,

//       visitDate:
//         this.filters.visitDate == ''
//           ? null
//           : this.filters.visitDate,

//       status:
//         this.filters.status == ''
//           ? null
//           : this.filters.status,

//       pageNumber: this.pageNumber,

//       pageSize: this.pageSize

//     };

//     this.mrService.get_visit_plan(payload)
//       .subscribe({

//         next: (res: any) => {

//           this.loading = false;

//           if (!res.success) {

//             this.visits = [];

//             this.totalRecords = 0;

//             this.totalPages = 1;

//             return;

//           }

//           this.visits = res.data || [];

//           this.totalRecords = res.totalRecords;

//           this.totalPages = res.totalPages;

//           this.pageNumber = res.pageNumber;

//           this.pageSize = res.pageSize;

//           this.mapCustomerData();

//           this.calculateDashboard();

//         },

//         error: () => {

//           this.loading = false;

//           Swal.fire(
//             'Error',
//             'Unable to fetch visits.',
//             'error'
//           );

//         }

//       });

//   }

//   mapCustomerData(): void {

//     this.visits.forEach((visit: any) => {

//       if (!visit.places) {

//         visit.customerName = '-';

//         visit.mobile = '-';

//         visit.address = '-';

//         return;

//       }

//       const firstPlace = visit.places[0];

//       const customer =
//         this.customerMap[firstPlace.customerId];

//       if (!customer) {

//         visit.customerName = '-';

//         visit.mobile = '-';

//         visit.address = '-';

//         return;

//       }

//       visit.customerName = customer.name;

//       visit.mobile = customer.mobile;

//       visit.address = customer.region;

//     });

//   }


//   calculateDashboard(): void {

//     this.assignedCount =
//       this.visits.filter(
//         (x: any) => x.status === 'Assigned'
//       ).length;

//     this.acceptedCount =
//       this.visits.filter(
//         (x: any) => x.status === 'Accepted'
//       ).length;

//     this.rejectedCount =
//       this.visits.filter(
//         (x: any) => x.status === 'Rejected'
//       ).length;

//     this.inProgressCount =
//       this.visits.filter(
//         (x: any) => x.status === 'In Progress'
//       ).length;

//     this.completedCount =
//       this.visits.filter(
//         (x: any) => x.status === 'Completed'
//       ).length;

//     const today =
//       new Date().toISOString().split('T')[0];

//     this.todayCount =
//       this.visits.filter((x: any) =>
//         x.visitDate.substring(0, 10) == today
//       ).length;

//     this.todayProgress =
//       this.todayCount == 0
//         ? 0
//         : Math.round(
//           (this.completedCount /
//             this.todayCount) *
//           100
//         );

//   }

//   // ======================================================
//   // FILTERS
//   // ======================================================

//   applyFilters(): void {

//     this.pageNumber = 1;

//     this.loadVisits();

//   }

//   resetFilters(): void {

//     this.filters = {

//       visitDate: '',

//       status: ''

//     };

//     this.pageNumber = 1;

//     this.loadVisits();

//   }

//   openCompleteForPlace(visit: any, place: any): void {

//     this.selectedPlace = place;
//     this.selectedVisit = visit;

//     Swal.fire({
//       title: 'Complete Visit',
//       html: `
//       <textarea
//         id="visitRemarks"
//         class="swal2-textarea"
//         placeholder="Enter visit remarks..."
//         style="height:120px"></textarea>
//     `,
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Complete',
//       confirmButtonColor: '#16a34a',
//       preConfirm: () => {

//         const remarks =
//           (document.getElementById('visitRemarks') as HTMLTextAreaElement)
//             .value.trim();

//         if (!remarks) {
//           Swal.showValidationMessage('Remarks required');
//           return;
//         }

//         return remarks;
//       }

//     }).then(result => {

//       if (!result.isConfirmed) return;

//       this.completeVisitForPlace(result.value);

//     });

//   }

//   completeVisitForPlace(remarks: string): void {

//     if (!this.selectedVisit || !this.selectedPlace) return;

//     this.getCurrentLocation().then(location => {

//       const shownProductIds = (this.selectedPlace.products || [])
//         .filter((p: any) => p.showProduct)
//         .map((p: any) => p.productId);

//       const payload = {

//         visitPlanId: this.selectedVisit.visitPlanId,

//         // ✅ IMPORTANT FIX: correct customer detail ID
//         visitPlanDetailId: this.selectedPlace.visitPlanDetailId,

//         currentLatitude: location.latitude,

//         currentLongitude: location.longitude,

//         visitRemarks: remarks,

//         shownProductIds

//       };

//       this.mrService.complete_visit(payload)
//         .subscribe({

//           next: (res: any) => {

//             if (!res.success) {
//               Swal.fire('Error', res.message, 'error');
//               return;
//             }

//             Swal.fire({
//               icon: 'success',
//               title: 'Customer Visit Completed',
//               text: res.message,
//               timer: 1500,
//               showConfirmButton: false
//             });

//             this.selectedPlace = null;
//             this.loadVisits();

//           },

//           error: (err) => {
//             Swal.fire(
//               'Error',
//               err?.error?.message || 'Something went wrong',
//               'error'
//             );
//           }

//         });

//     }).catch(() => {

//       Swal.fire(
//         'Location Error',
//         'Enable GPS to complete visit',
//         'warning'
//       );

//     });

//   }

//   // ======================================================
//   // PAGINATION
//   // ======================================================

//   previousPage(): void {

//     if (this.pageNumber > 1) {

//       this.pageNumber--;

//       this.loadVisits();

//     }

//   }

//   nextPage(): void {

//     if (this.pageNumber < this.totalPages) {

//       this.pageNumber++;

//       this.loadVisits();

//     }

//   }

//   goToPage(page: number): void {

//     this.pageNumber = page;

//     this.loadVisits();

//   }

//   getPageNumbers(): number[] {

//     const pages: number[] = [];

//     for (let i = 1; i <= this.totalPages; i++) {

//       pages.push(i);

//     }

//     return pages;

//   }

//   // ======================================================
//   // STATUS BADGE
//   // ======================================================

//   getStatusClass(status: string): string {

//     switch (status) {

//       case 'Assigned':
//         return 'bg-gray-100 text-gray-700';

//       case 'Accepted':
//         return 'bg-green-100 text-green-700';

//       case 'Rejected':
//         return 'bg-red-100 text-red-700';

//       case 'InProgress':
//         return 'bg-yellow-100 text-yellow-700';

//       case 'Completed':
//         return 'bg-blue-100 text-blue-700';

//       case 'Cancelled':
//         return 'bg-gray-300 text-gray-700';

//       default:
//         return 'bg-gray-100 text-gray-700';

//     }

//   }

//   // ======================================================
//   // TOTAL PRODUCTS
//   // ======================================================

//   getTotalProducts(visit: any): number {

//     if (!visit.products) {

//       return 0;

//     }

//     return visit.products.length;

//   }

//   // ======================================================
//   // BUTTON VISIBILITY
//   // ======================================================

//   canAccept(visit: any): boolean {

//     return visit.status === 'Assigned';

//   }

//   canReject(visit: any): boolean {

//     return visit.status === 'Assigned';

//   }

//   canStartVisit(visit: any): boolean {

//     return visit.status === 'Accepted';

//   }

//   canRoute(visit: any): boolean {

//     return visit.status === 'Accepted'
//       || visit.status === 'InProgress'
//       || visit.status === 'Completed';

//   }

//   canEndVisit(visit: any): boolean {

//     return visit.status === 'InProgress' || visit.status === 'Completed';

//   }

//   // ======================================================
//   // VIEW VISIT
//   // ======================================================

//   viewVisit(visit: any): void {
//     this.selectedVisit = visit;
//     this.showViewModal = true;
//   }

//   closeViewModal(): void {
//     this.showViewModal = false;
//     this.selectedVisit = null;
//   }

//   getCustomerName(customerId: number): string {
//     return this.customerMap?.[customerId]?.name || '-';
//   }

//   // ======================================================
//   // ACCEPT VISIT
//   // ======================================================

//   acceptVisit(visit: any): void {

//     Swal.fire({

//       title: 'Accept Visit?',

//       text: 'Do you want to accept this visit?',

//       icon: 'question',

//       showCancelButton: true,

//       confirmButtonColor: '#16a34a',

//       confirmButtonText: 'Accept'

//     }).then(result => {

//       if (!result.isConfirmed) {

//         return;

//       }

//       const payload = {

//         visitPlanId: visit.visitPlanId,

//         mrId: this.mrId,

//         status: 'Accepted'

//       };

//       this.mrService
//         .visit_accepted_by_mr(payload)
//         .subscribe({

//           next: (res: any) => {

//             if (!res.success) {

//               Swal.fire(
//                 'Error',
//                 res.message,
//                 'error'
//               );

//               return;

//             }

//             Swal.fire(
//               'Success',
//               res.message,
//               'success'
//             );

//             this.loadVisits();

//           },

//           error: () => {

//             Swal.fire(
//               'Error',
//               'Unable to accept visit.',
//               'error'
//             );

//           }

//         });

//     });

//   }

//   // ======================================================
//   // REJECT VISIT
//   // ======================================================

//   rejectVisit(visit: any): void {

//     Swal.fire({

//       title: 'Reject Visit?',

//       text: 'Do you really want to reject this visit?',

//       icon: 'warning',

//       showCancelButton: true,

//       confirmButtonColor: '#dc2626',

//       confirmButtonText: 'Reject'

//     }).then(result => {

//       if (!result.isConfirmed) {

//         return;

//       }

//       const payload = {

//         visitPlanId: visit.visitPlanId,

//         mrId: this.mrId,

//         status: 'Rejected'

//       };

//       this.mrService
//         .visit_accepted_by_mr(payload)
//         .subscribe({

//           next: (res: any) => {

//             if (!res.success) {

//               Swal.fire(
//                 'Error',
//                 res.message,
//                 'error'
//               );

//               return;

//             }

//             Swal.fire(
//               'Rejected',
//               res.message,
//               'success'
//             );

//             this.loadVisits();

//           },

//           error: () => {

//             Swal.fire(
//               'Error',
//               'Unable to reject visit.',
//               'error'
//             );

//           }

//         });

//     });

//   }

//   // ======================================================
//   // START VISIT
//   // ======================================================

//   async startVisit(visit: any): Promise<void> {

//     const result = await Swal.fire({

//       title: 'Start Visit?',

//       text: 'Your current location will be captured.',

//       icon: 'question',

//       showCancelButton: true,

//       confirmButtonText: 'Start'

//     });

//     if (!result.isConfirmed) {

//       return;

//     }

//     try {

//       const location = await this.getCurrentLocation();

//       this.currentLatitude = location.latitude;

//       this.currentLongitude = location.longitude;

//       this.currentIp = await this.getPublicIp();

//       const payload = {

//         visitPlanId: visit.visitPlanId,

//         mrId: this.mrId,

//         latitude: this.currentLatitude,

//         longitude: this.currentLongitude,

//         ipAddress: this.currentIp

//       };

//       this.mrService.start_visit(payload)
//         .subscribe({

//           next: (res: any) => {

//             if (!res.success) {

//               Swal.fire(
//                 'Error',
//                 res.message,
//                 'error'
//               );

//               return;

//             }

//             this.sessionId = res.sessionId;

//             visit.status = 'In Progress';

//             this.startTracking();

//             Swal.fire(
//               'Success',
//               res.message,
//               'success'
//             );

//             this.loadVisits();

//           },

//           error: (err) => {
//             Swal.fire(
//               'Error',
//               err?.error?.message || 'Something went wrong',
//               'error'
//             );
//           }

//         });

//     }

//     catch {

//       Swal.fire(
//         'Location Required',
//         'Please enable location access.',
//         'warning'
//       );

//     }

//   }

//   startTracking(): void {

//     if (this.trackingTimer) {

//       clearInterval(this.trackingTimer);

//     }

//     this.trackingTimer = setInterval(() => {

//       this.trackVisit();

//     }, 60000);

//   }

//   async trackVisit(): Promise<void> {

//     if (!this.sessionId) {

//       return;

//     }

//     try {

//       const location = await this.getCurrentLocation();

//       const payload = {

//         sessionId: this.sessionId,

//         latitude: location.latitude,

//         longitude: location.longitude,

//         ipAddress: this.currentIp

//       };

//       this.mrService.track_visit(payload)
//         .subscribe({

//           next: () => {

//             console.log('Tracking Updated');

//           },

//           error: () => {

//             console.log('Tracking Failed');

//           }

//         });

//     }

//     catch {

//       console.log('Location unavailable');

//     }

//   }

//   stopTracking(): void {

//     if (this.trackingTimer) {

//       clearInterval(this.trackingTimer);

//       this.trackingTimer = null;

//     }

//   }


//   async completeVisit(visit: any): Promise<void> {

//     const result = await Swal.fire({

//       title: 'Complete Visit',

//       html: `
//       <textarea
//         id="visitRemarks"
//         class="swal2-textarea"
//         placeholder="Enter visit remarks..."
//         style="height:120px"></textarea>
//     `,

//       icon: 'question',

//       showCancelButton: true,

//       confirmButtonText: 'Complete Visit',

//       confirmButtonColor: '#16a34a',

//       cancelButtonText: 'Cancel',

//       focusConfirm: false,

//       preConfirm: () => {

//         const remarks = (
//           document.getElementById('visitRemarks') as HTMLTextAreaElement
//         ).value.trim();

//         if (!remarks) {

//           Swal.showValidationMessage(
//             'Please enter visit remarks.'
//           );

//           return;

//         }

//         return remarks;

//       }

//     });

//     if (!result.isConfirmed) {

//       return;

//     }

//     try {

//       const location = await this.getCurrentLocation();

//       const lastPlace =
//         visit.places[visit.places.length - 1];

//       const shownProductIds = [

//         ...new Set(

//           visit.places.flatMap((place: any) =>

//             (place.products || [])
//               .filter((product: any) => product.showProduct)
//               .map((product: any) => product.productId)

//           )

//         )

//       ];

//       const payload = {

//         visitPlanId: visit.visitPlanId,

//         visitPlanDetailId:
//           lastPlace.visitPlanDetailId,

//         currentLatitude:
//           location.latitude,

//         currentLongitude:
//           location.longitude,

//         visitRemarks:
//           result.value,

//         shownProductIds

//       };

//       this.mrService
//         .complete_visit(payload)
//         .subscribe({

//           next: (res: any) => {

//             if (!res.success) {

//               Swal.fire(
//                 'Error',
//                 res.message,
//                 'error'
//               );

//               return;

//             }

//             Swal.fire({

//               icon: 'success',

//               title: 'Visit Completed',

//               text: res.message,

//               timer: 1800,

//               showConfirmButton: false

//             });

//             this.endVisit(visit);

//           },

//           error: () => {

//             Swal.fire(
//               'Error',
//               'Unable to complete visit.',
//               'error'
//             );

//           }

//         });

//     }

//     catch {

//       Swal.fire(
//         'Location Error',
//         'Unable to fetch your current location.',
//         'warning'
//       );

//     }

//   }

//   // ======================================================
//   // END VISIT
//   // ======================================================

//   async endVisit(visit: any): Promise<void> {

//     if (!this.sessionId) {

//       Swal.fire(
//         'Error',
//         'Session not found.',
//         'error'
//       );

//       return;

//     }

//     try {

//       const location =
//         await this.getCurrentLocation();

//       this.currentLatitude = location.latitude;

//       this.currentLongitude = location.longitude;

//       this.currentIp =
//         await this.getPublicIp();

//       const payload = {

//         sessionId: this.sessionId,

//         latitude: this.currentLatitude,

//         longitude: this.currentLongitude,

//         ipAddress: this.currentIp

//       };

//       this.mrService
//         .end_visit(payload)
//         .subscribe({

//           next: (res: any) => {

//             if (!res.success) {

//               Swal.fire(
//                 'Error',
//                 res.message,
//                 'error'
//               );

//               return;

//             }

//             this.stopTracking();

//             this.sessionId = 0;

//             localStorage.removeItem(
//               'visitSessionId'
//             );

//             visit.status = 'Completed';

//             Swal.fire({

//               icon: 'success',

//               title: 'Visit Ended',

//               text: res.message,

//               timer: 1800,

//               showConfirmButton: false

//             });

//             this.loadVisits();

//           },

//           error: () => {

//             Swal.fire(
//               'Error',
//               'Unable to end visit.',
//               'error'
//             );

//           }

//         });

//     }

//     catch {

//       Swal.fire(
//         'Location Error',
//         'Unable to fetch your current location.',
//         'warning'
//       );

//     }

//   }

//   // ======================================================
//   // ROUTE
//   // ======================================================

//   showTracking(visit: any): void {

//     this.mrService
//       .get_tracking_of_mr(visit.visitPlanId)
//       .subscribe({

//         next: (res: any) => {

//           if (!res.success) {

//             Swal.fire(
//               'Error',
//               res.message,
//               'error'
//             );

//             return;

//           }

//           this.trackingData = res.data;

//           this.openTrackingMap();

//         },

//         error: () => {

//           Swal.fire(
//             'Error',
//             'Unable to fetch tracking.',
//             'error'
//           );

//         }

//       });

//   }

//   openTrackingMap(): void {

//     Swal.fire({

//       title: 'MR Route',

//       width: '90%',

//       html: `

//         <div id="trackingMap"
//              style="height:600px;border-radius:12px;"></div>

//     `,

//       showConfirmButton: true,

//       confirmButtonText: 'Close',

//       didOpen: () => {

//         setTimeout(() => {

//           this.loadTrackingMap();

//         }, 300);

//       }

//     });

//   }


//   loadTrackingMap(): void {

//     if (!this.trackingData || !this.trackingData.session) {
//       return;
//     }

//     const session = this.trackingData.session;

//     // Destroy previous map
//     if (this.map) {
//       this.map.remove();
//     }

//     // Create map
//     this.map = L.map('trackingMap');

//     L.tileLayer(
//       'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//       {
//         maxZoom: 19,
//         attribution: '&copy; OpenStreetMap contributors'
//       }
//     ).addTo(this.map);

//     const routeCoordinates: L.LatLngExpression[] = [];

//     // -------------------------------
//     // START MARKER
//     // -------------------------------

//     if (
//       session.startLatitude != null &&
//       session.startLongitude != null
//     ) {

//       const startLatLng: L.LatLngExpression = [
//         session.startLatitude,
//         session.startLongitude
//       ];

//       routeCoordinates.push(startLatLng);

//       L.marker(startLatLng)
//         .addTo(this.map)
//         .bindPopup(`
//         <b>Visit Started</b><br>
//         Time :
//         ${new Date(session.startTime).toLocaleString()}
//       `);

//     }

//     // -------------------------------
//     // TRACKING POINTS
//     // -------------------------------

//     if (
//       session.trackingPoints &&
//       session.trackingPoints.length > 0
//     ) {

//       session.trackingPoints.forEach(
//         (point: any, index: number) => {

//           const latLng: L.LatLngExpression = [
//             point.latitude,
//             point.longitude
//           ];

//           routeCoordinates.push(latLng);

//           L.circleMarker(latLng, {

//             radius: 6,

//             color: '#2563eb',

//             fillColor: '#3b82f6',

//             fillOpacity: 1,

//             weight: 2

//           })
//             .addTo(this.map)
//             .bindPopup(`
//             <b>Tracking Point ${index + 1}</b><br>
//             Time :
//             ${new Date(point.trackedAt).toLocaleString()}
//           `);

//         });

//     }

//     // -------------------------------
//     // END MARKER
//     // -------------------------------

//     if (
//       session.endLatitude != null &&
//       session.endLongitude != null
//     ) {

//       const endLatLng: L.LatLngExpression = [
//         session.endLatitude,
//         session.endLongitude
//       ];

//       routeCoordinates.push(endLatLng);

//       L.marker(endLatLng)
//         .addTo(this.map)
//         .bindPopup(`
//         <b>Visit Ended</b><br>
//         Time :
//         ${new Date(session.endTime).toLocaleString()}
//       `);

//     }

//     else if (routeCoordinates.length > 0) {

//       const lastPoint =
//         routeCoordinates[routeCoordinates.length - 1];

//       L.marker(lastPoint)
//         .addTo(this.map)
//         .bindPopup(`
//         <b>Current Position</b>
//       `);

//     }

//     // -------------------------------
//     // ROUTE LINE
//     // -------------------------------

//     if (routeCoordinates.length > 1) {

//       this.routeLayer = L.polyline(
//         routeCoordinates,
//         {
//           color: '#2563eb',
//           weight: 5,
//           opacity: 0.8
//         }
//       ).addTo(this.map);

//       this.map.fitBounds(
//         this.routeLayer.getBounds(),
//         {
//           padding: [40, 40]
//         }
//       );

//     }

//     else if (routeCoordinates.length === 1) {

//       this.map.setView(routeCoordinates[0] as L.LatLngExpression, 16);

//     }

//   }



//   getCurrentLocation(): Promise<any> {

//     return new Promise((resolve, reject) => {

//       if (!navigator.geolocation) {

//         reject('Geolocation not supported');

//         return;

//       }

//       navigator.geolocation.getCurrentPosition(

//         position => {

//           resolve({

//             latitude: position.coords.latitude,

//             longitude: position.coords.longitude

//           });

//         },

//         error => {

//           reject(error);

//         },

//         {

//           enableHighAccuracy: true,

//           timeout: 10000,

//           maximumAge: 0

//         }

//       );

//     });

//   }

//   async getPublicIp(): Promise<string> {

//     try {

//       const response: any = await this.http
//         .get('https://api.ipify.org?format=json')
//         .toPromise();

//       return response.ip;

//     }

//     catch {

//       return '';

//     }

//   }

//   ngOnDestroy(): void {

//     // Stop 9-minute tracking timer
//     this.stopTracking();

//     // Complete all subscriptions
//     this.destroy$.next();
//     this.destroy$.complete();

//   }

// }



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
  BadgeCheck
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

  // Icons
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
  BadgeCheck = BadgeCheck;

  // Logged-in User
  agencyId: number = Number(localStorage.getItem('aid'));
  mrId: number = Number(localStorage.getItem('mid'));
  areaManagerId: number = 0;

  // Loading
  loading = false;

  // Visit Data
  visits: any[] = [];

  // Customers
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

  // Dashboard
  assignedCount = 0;
  acceptedCount = 0;
  rejectedCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  todayCount = 0;
  todayProgress = 0;

  // Tracking
  sessionId = 0;
  currentLatitude = 0;
  currentLongitude = 0;
  currentIp = '';
  trackingTimer: any;

  // Complete Visit
  selectedVisit: any = null;
  visitRemarks = '';
  selectedProductIds: number[] = [];

  showViewModal: boolean = false;
  selectedPlace: any = null;

  trackingData: any = null;
  map!: L.Map;
  routeLayer!: L.Polyline;

  constructor(
    private mrService: MrService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading = true;
    this.getAssignedAreaManager();
  }

  getAssignedAreaManager(): void {
    const params = {
      medicalRepresentativeId: this.mrId
    };

    this.mrService.get_assigned_area_manager(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (!res.success) {
            this.loading = false;
            Swal.fire(
              'Error',
              'Area Manager not assigned.',
              'error'
            );
            return;
          }

          this.areaManagerId = res.data.areaManagerId;
          this.loadCustomers();
        },
        error: () => {
          this.loading = false;
          Swal.fire(
            'Error',
            'Unable to fetch Area Manager.',
            'error'
          );
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
            Swal.fire(
              'Error',
              'Unable to fetch customers.',
              'error'
            );
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
          Swal.fire(
            'Error',
            'Unable to fetch customers.',
            'error'
          );
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
          this.checkAndRestoreActiveTracking();
        },
        error: () => {
          this.loading = false;
          Swal.fire(
            'Error',
            'Unable to fetch visits.',
            'error'
          );
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

  /**
   * Automatically recovers tracking state if an active session exists in backend
   */
  checkAndRestoreActiveTracking(): void {
    const activeVisit = this.visits.find(
      (v: any) => v.status === 'InProgress' || v.status === 'In Progress'
    );

    if (activeVisit && !this.trackingTimer) {
      this.mrService.get_active_session(activeVisit.visitPlanId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            if (res.success && res.sessionId) {
              this.sessionId = res.sessionId;
              localStorage.setItem('visitSessionId', this.sessionId.toString());
              this.startTracking();
            }
          },
          error: () => console.log('No active session found on initialization.')
        });
    }
  }

  // ======================================================
  // FILTERS
  // ======================================================

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadVisits();
  }

  resetFilters(): void {
    this.filters = {
      visitDate: '',
      status: ''
    };
    this.pageNumber = 1;
    this.loadVisits();
  }

  openCompleteForPlace(visit: any, place: any): void {
    this.selectedPlace = place;
    this.selectedVisit = visit;

    Swal.fire({
      title: 'Complete Visit',
      html: `
        <textarea
          id="visitRemarks"
          class="swal2-textarea"
          placeholder="Enter visit remarks..."
          style="height:120px"></textarea>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Complete',
      confirmButtonColor: '#16a34a',
      preConfirm: () => {
        const remarks = (document.getElementById('visitRemarks') as HTMLTextAreaElement).value.trim();
        if (!remarks) {
          Swal.showValidationMessage('Remarks required');
          return;
        }
        return remarks;
      }
    }).then(result => {
      if (!result.isConfirmed) return;
      this.completeVisitForPlace(result.value);
    });
  }

  completeVisitForPlace(remarks: string): void {
    if (!this.selectedVisit || !this.selectedPlace) return;

    this.getCurrentLocation().then(location => {
      const shownProductIds = (this.selectedPlace.products || [])
        .filter((p: any) => p.showProduct)
        .map((p: any) => p.productId);

      const payload = {
        visitPlanId: this.selectedVisit.visitPlanId,
        visitPlanDetailId: this.selectedPlace.visitPlanDetailId,
        currentLatitude: location.latitude,
        currentLongitude: location.longitude,
        visitRemarks: remarks,
        shownProductIds
      };

      this.mrService.complete_visit(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            if (!res.success) {
              Swal.fire('Error', res.message, 'error');
              return;
            }

            Swal.fire({
              icon: 'success',
              title: 'Customer Visit Completed',
              text: res.message,
              timer: 1500,
              showConfirmButton: false
            });

            this.selectedPlace = null;
            this.loadVisits();
          },
          error: (err) => {
            Swal.fire(
              'Error',
              err?.error?.message || 'Something went wrong',
              'error'
            );
          }
        });
    }).catch(() => {
      Swal.fire(
        'Location Error',
        'Enable GPS to complete visit',
        'warning'
      );
    });
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
      case 'Assigned': return 'bg-gray-100 text-gray-700';
      case 'Accepted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'InProgress':
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-gray-300 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  // ======================================================
  // TOTAL PRODUCTS
  // ======================================================

  getTotalProducts(visit: any): number {
    return visit.products ? visit.products.length : 0;
  }

  // ======================================================
  // BUTTON VISIBILITY
  // ======================================================

  canAccept(visit: any): boolean { return visit.status === 'Assigned'; }
  canReject(visit: any): boolean { return visit.status === 'Assigned'; }
  canStartVisit(visit: any): boolean { return visit.status === 'Accepted'; }
  canRoute(visit: any): boolean {
    return visit.status === 'Accepted' || visit.status === 'InProgress' || visit.status === 'In Progress' || visit.status === 'Completed';
  }
  canEndVisit(visit: any): boolean {
    return visit.status === 'InProgress' || visit.status === 'In Progress' || visit.status === 'Completed';
  }

  // ======================================================
  // VIEW VISIT
  // ======================================================

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
      text: 'Do you want to accept this visit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      confirmButtonText: 'Accept'
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
            Swal.fire('Success', res.message, 'success');
            this.loadVisits();
          },
          error: () => {
            Swal.fire('Error', 'Unable to accept visit.', 'error');
          }
        });
    });
  }

  rejectVisit(visit: any): void {
    Swal.fire({
      title: 'Reject Visit?',
      text: 'Do you really want to reject this visit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Reject'
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
          error: () => {
            Swal.fire('Error', 'Unable to reject visit.', 'error');
          }
        });
    });
  }

  // ======================================================
  // START VISIT & TRACKING
  // ======================================================

async startVisit(visit: any): Promise<void> {

  // Current date (ignore time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Visit date (ignore time)
  const visitDate = new Date(visit.visitDate);
  visitDate.setHours(0, 0, 0, 0);

  // Prevent starting future visits
  if (visitDate > today) {
    await Swal.fire({
      icon: 'warning',
      title: 'Future Visit',
      text: 'You cannot start a future scheduled visit.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Start Visit?',
    text: 'Your current location will be captured.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Start',
    cancelButtonText: 'Cancel'
  });

  if (!result.isConfirmed) {
    return;
  }

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
            Swal.fire({
              icon: 'error',
              title: 'Cannot Start Visit',
              text: res.message,
              confirmButtonText: 'OK'
            });
            return;
          }

          this.sessionId = res.sessionId;
          localStorage.setItem(
            'visitSessionId',
            this.sessionId.toString()
          );

          visit.status = 'In Progress';

          this.startTracking();

          Swal.fire({
            icon: 'success',
            title: 'Visit Started',
            text: res.message,
            timer: 1800,
            showConfirmButton: false
          });

          this.loadVisits();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'Something went wrong.',
            confirmButtonText: 'OK'
          });
        }
      });

  } catch {
    Swal.fire({
      icon: 'warning',
      title: 'Location Required',
      text: 'Please enable location access to start the visit.',
      confirmButtonText: 'OK'
    });
  }
}

  startTracking(): void {
    if (this.trackingTimer) {
      clearInterval(this.trackingTimer);
    }

    // Ping tracking immediately once, then interval
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
          next: () => console.log('Tracking Updated'),
          error: () => console.log('Tracking Failed')
        });
    } catch {
      console.log('Location unavailable');
    }
  }

  stopTracking(): void {
    if (this.trackingTimer) {
      clearInterval(this.trackingTimer);
      this.trackingTimer = null;
    }
  }

  // ======================================================
  // COMPLETE & END VISIT (WITH BACKEND SESSION RECOVERY)
  // ======================================================

  async completeVisit(visit: any): Promise<void> {
    const result = await Swal.fire({
      title: 'Complete Visit',
      html: `
        <textarea
          id="visitRemarks"
          class="swal2-textarea"
          placeholder="Enter visit remarks..."
          style="height:120px"></textarea>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Complete Visit',
      confirmButtonColor: '#16a34a',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      preConfirm: () => {
        const remarks = (document.getElementById('visitRemarks') as HTMLTextAreaElement).value.trim();
        if (!remarks) {
          Swal.showValidationMessage('Please enter visit remarks.');
          return;
        }
        return remarks;
      }
    });

    if (!result.isConfirmed) return;

    try {
      const location = await this.getCurrentLocation();
      const lastPlace = visit.places[visit.places.length - 1];

      const shownProductIds = [
        ...new Set(
          visit.places.flatMap((place: any) =>
            (place.products || [])
              .filter((product: any) => product.showProduct)
              .map((product: any) => product.productId)
          )
        )
      ];

      const payload = {
        visitPlanId: visit.visitPlanId,
        visitPlanDetailId: lastPlace.visitPlanDetailId,
        currentLatitude: location.latitude,
        currentLongitude: location.longitude,
        visitRemarks: result.value,
        shownProductIds
      };

      this.mrService.complete_visit(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            if (!res.success) {
              Swal.fire('Error', res.message, 'error');
              return;
            }

            Swal.fire({
              icon: 'success',
              title: 'Visit Completed',
              text: res.message,
              timer: 1800,
              showConfirmButton: false
            });

            // Fetch session directly from backend before ending
            this.initiateEndVisit(visit);
          },
          error: () => {
            Swal.fire('Error', 'Unable to complete visit.', 'error');
          }
        });
    } catch {
      Swal.fire(
        'Location Error',
        'Unable to fetch your current location.',
        'warning'
      );
    }
  }

  /**
   * Helper method to retrieve active sessionId from API before stopping session
   */
  initiateEndVisit(visit: any): void {
    this.mrService.get_active_session(visit.visitPlanId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (!res.success || !res.sessionId) {
            Swal.fire('Error', res.message || 'No active session found.', 'error');
            return;
          }

          this.endVisit(visit, res.sessionId);
        },
        error: () => {
          Swal.fire('Error', 'Unable to retrieve active session.', 'error');
        }
      });
  }

  /**
   * Ends the visit session in backend and terminates tracking interval
   */
async endVisit(visit: any, activeSessionId: number): Promise<void> {
  try {
    const location = await this.getCurrentLocation();
    this.currentLatitude = location.latitude;
    this.currentLongitude = location.longitude;
    this.currentIp = await this.getPublicIp();

    const payload = {
      sessionId: activeSessionId,
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
              text: res.message || 'Complete all customer visits before ending the visit.',
              confirmButtonText: 'OK'
            });
            return;
          }

          this.stopTracking();
          this.sessionId = 0;
          localStorage.removeItem('visitSessionId');

          visit.status = 'Completed';

          Swal.fire({
            icon: 'success',
            title: 'Visit Ended',
            text: res.message,
            timer: 1800,
            showConfirmButton: false
          });

          this.loadVisits();
        },
        error: (err) => {
          Swal.fire({
            icon: 'warning',
            title: 'Cannot End Visit',
            text: err?.error?.message || 'Unable to end visit.',
            confirmButtonText: 'OK'
          });
        }
      });

  } catch (error) {
    Swal.fire({
      icon: 'warning',
      title: 'Location Error',
      text: 'Unable to fetch your current location.',
      confirmButtonText: 'OK'
    });
  }
}

  // ======================================================
  // ROUTE & MAP
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
        error: () => {
          Swal.fire('Error', 'Unable to fetch tracking.', 'error');
        }
      });
  }

  openTrackingMap(): void {
    Swal.fire({
      title: 'MR Route',
      width: '90%',
      html: `<div id="trackingMap" style="height:600px;border-radius:12px;"></div>`,
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
    if (!this.trackingData || !this.trackingData.session) return;

    const session = this.trackingData.session;

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('trackingMap');

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);

    const routeCoordinates: L.LatLngExpression[] = [];

    // START MARKER
    if (session.startLatitude != null && session.startLongitude != null) {
      const startLatLng: L.LatLngExpression = [
        session.startLatitude,
        session.startLongitude
      ];
      routeCoordinates.push(startLatLng);

      L.marker(startLatLng)
        .addTo(this.map)
        .bindPopup(`
          <b>Visit Started</b><br>
          Time : ${new Date(session.startTime).toLocaleString()}
        `);
    }

    // TRACKING POINTS
    if (session.trackingPoints && session.trackingPoints.length > 0) {
      session.trackingPoints.forEach((point: any, index: number) => {
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
            Time : ${new Date(point.trackedAt).toLocaleString()}
          `);
      });
    }

    // END MARKER
    if (session.endLatitude != null && session.endLongitude != null) {
      const endLatLng: L.LatLngExpression = [
        session.endLatitude,
        session.endLongitude
      ];
      routeCoordinates.push(endLatLng);

      L.marker(endLatLng)
        .addTo(this.map)
        .bindPopup(`
          <b>Visit Ended</b><br>
          Time : ${new Date(session.endTime).toLocaleString()}
        `);
    } else if (routeCoordinates.length > 0) {
      const lastPoint = routeCoordinates[routeCoordinates.length - 1];
      L.marker(lastPoint)
        .addTo(this.map)
        .bindPopup(`<b>Current Position</b>`);
    }

    // ROUTE LINE
    if (routeCoordinates.length > 1) {
      this.routeLayer = L.polyline(routeCoordinates, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.8
      }).addTo(this.map);

      this.map.fitBounds(this.routeLayer.getBounds(), {
        padding: [40, 40]
      });
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
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  async getPublicIp(): Promise<string> {
    try {
      const response: any = await this.http
        .get('https://api.ipify.org?format=json')
        .toPromise();
      return response.ip;
    } catch {
      return '';
    }
  }

  ngOnDestroy(): void {
    // Stop background tracking interval
    this.stopTracking();

    // Clean up RxJS subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}