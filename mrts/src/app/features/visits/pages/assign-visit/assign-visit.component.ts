import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  ClipboardCheck,
  ArrowLeft,
  Users,
  MapPin,
  Target,
  FileText,
  Send,
  Plus,
  Trash2,
  Package
} from 'lucide-angular';
import { VisitService } from '../../services/visit.service';

@Component({
  selector: 'app-assign-visit',
  templateUrl: './assign-visit.component.html',
  styleUrl: './assign-visit.component.css'
})
export class AssignVisitComponent implements OnInit {

  // Icons
  ClipboardCheck = ClipboardCheck;
  ArrowLeft = ArrowLeft;
  Users = Users;
  MapPin = MapPin;
  Target = Target;
  FileText = FileText;
  Send = Send;
  Plus = Plus;
  Trash2 = Trash2;
  Package = Package;

  // Main Payload
  assignVisit: any = {
    agencyId: Number(localStorage.getItem('aid')),
    mrId: null,
    routeId: null,
    assignedBy: Number(localStorage.getItem('mid')),
    visitDate: '',
    remarks: '',
    places: []
  };

  // Dropdown Data
  mrList: any[] = [];
  routeList: any[] = [];      // Route list for MR
  customerList: any[] = [];   // Customer list based on Route
  products: any[] = [];

  // Modals
  showCustomerModal = false;
  showProductModal = false;

  // Current Customer Visit
  currentPlace: any = null;

  // Product Search
  productSearch = {
    name: '',
    brandName: ''
  };

  selectedProducts: any[] = [];

  isSubmitting = false;
  loadingProducts = false;
  loadingRoutes = false;
  loadingCustomers = false;

  mrSearch = '';
  routeSearch = '';
  customerSearch = '';

  filteredCustomerList: any[] = [];
  filteredMrList: any[] = [];
  filteredRouteList: any[] = [];


  loggedInAreaManagerId: number | null = null;
medicalRepresentativeId: number | null = null;
  constructor(
    private visitService: VisitService
  ) { }

  ngOnInit(): void {
    this.loadMRs();
    // this.getAreaManagerForUpdateCustomer();
  }

  // =====================================
  // LOAD MRS
  // =====================================
  loadMRs(): void {
    const params = {
      assignedAreaManager: Number(localStorage.getItem('mid')),
      agencyId: Number(localStorage.getItem('aid'))
    };

    this.visitService.get_mrs(params).subscribe({
      next: (res: any) => {
        this.mrList = res?.data || [];
        this.filteredMrList = [...this.mrList];
      },
      error: (err) => {
        console.error('Error fetching MRs:', err);
      }
    });
  }

  filterMrList(): void {
    const search = this.mrSearch.trim().toLowerCase();

    if (!search) {
      this.filteredMrList = [...this.mrList];
      return;
    }

    this.filteredMrList = this.mrList.filter((mr: any) =>
      mr.name?.toLowerCase().includes(search) ||
      mr.mobile?.toString().includes(search)
    );
  }

  // =====================================
  // ON MR CHANGE -> LOAD ROUTES
  // =====================================
  onMrChange(mrId: number): void {

    this.routeList = [];
    this.filteredRouteList = [];
    this.customerList = [];

    this.assignVisit.routeId = null;
    this.assignVisit.places = [];

    this.routeSearch = '';

    if (!mrId) {
      return;
    }

    this.loadingRoutes = true;

    this.visitService.getRoutesByMedicalRepresentative(mrId).subscribe({

      next: (res: any) => {

        this.routeList = res?.data || [];
        this.filteredRouteList = [...this.routeList];

        this.loadingRoutes = false;
      },

      error: (err) => {

        console.error('Error fetching routes:', err);

        this.loadingRoutes = false;
      }
    });
  }

  filterRouteList(): void {
    const search = this.routeSearch.trim().toLowerCase();

    if (!search) {
      this.filteredRouteList = [...this.routeList];
      return;
    }

    this.filteredRouteList = this.routeList.filter((route: any) =>
      route.routeName?.toLowerCase().includes(search)
    );
  }
  // =====================================
  // ON ROUTE CHANGE -> LOAD CUSTOMERS
  // =====================================
  getAreaManagerForUpdateCustomer(): void {

  const agencyId = Number(localStorage.getItem('aid'));
  const medicalRepresentativeId =
    Number(localStorage.getItem('mid'));

  if (!agencyId || !medicalRepresentativeId) {
    console.error(
      'Agency ID or Medical Representative ID not found.'
    );
    return;
  }

  this.visitService
    .getAreaManagerForUpdateCustomer(
      agencyId,
      medicalRepresentativeId
    )
    .subscribe({

      next: (res: any) => {

        if (res?.success) {

          this.loggedInAreaManagerId =
            Number(res.areaManagerId);

          console.log(
            'Logged-in MR Area Manager ID:',
            this.loggedInAreaManagerId
          );
        }

      },

      error: (err: any) => {
        console.error(
          'Failed to get Area Manager:',
          err
        );
      }

    });
}


onRouteChange(routeId: number): void {

  this.customerList = [];
  this.filteredCustomerList = [];
  this.customerSearch = '';

  if (!routeId) {
    return;
  }

  const agencyId = Number(localStorage.getItem('aid'));
  const areaManagerId = Number(localStorage.getItem('mid'))

  if (!agencyId) {
    console.error('Agency ID not found in localStorage');
    this.loadingCustomers = false;
    return;
  }

  if (!areaManagerId) {
    console.error('Area Manager ID not found');
    this.loadingCustomers = false;
    return;
  }

  this.loadingCustomers = true;

  this.visitService
    .get_customers_by_route_visit(
      routeId,
      agencyId,
      areaManagerId
    )
    .subscribe({

      next: (res: any) => {

        this.customerList = Array.isArray(res) ? res : [];

        // Initialize filtered list
        this.filteredCustomerList = [
          ...this.customerList
        ];

        this.loadingCustomers = false;
      },

      error: (err) => {

        console.error(
          'Error fetching customers by route:',
          err
        );

        this.customerList = [];
        this.filteredCustomerList = [];

        this.loadingCustomers = false;
      }

    });
}



  filterCustomerList(): void {

    const search = this.customerSearch.trim().toLowerCase();

    if (!search) {
      this.filteredCustomerList = [...this.customerList];
      return;
    }

    this.filteredCustomerList = this.customerList.filter((customer: any) =>
      customer.name?.toLowerCase().includes(search) ||
      customer.mobile?.toString().includes(search)
    );
  }
  // =====================================
  // CUSTOMER VISIT MODAL
  // =====================================
  openCustomerModal(): void {
    if (!this.assignVisit.mrId) {
      Swal.fire('Validation', 'Please select a Medical Representative first', 'warning');
      return;
    }

    if (!this.assignVisit.routeId) {
      Swal.fire('Validation', 'Please select a Route first', 'warning');
      return;
    }

    this.currentPlace = {
      customerId: null,
      customerName: '',
      doctorId: null,
      plannedTime: '',
      sequenceNo: this.assignVisit.places.length + 1,
      remarks: '',
      productIds: [],        // Default to empty array (optional)
      selectedProducts: []   // Default to empty array (optional)
    };

    this.selectedProducts = [];
    this.showCustomerModal = true;
  }

  closeCustomerModal(): void {
    this.showCustomerModal = false;
  }

  // =====================================
  // PRODUCT MODAL & SELECTION (OPTIONAL)
  // =====================================
  openProductModal(): void {
    // Safely copy existing products if present, else fallback to empty array
    this.selectedProducts = Array.isArray(this.currentPlace?.selectedProducts)
      ? [...this.currentPlace.selectedProducts]
      : [];

    this.showProductModal = true;
    this.loadProducts();
  }

  closeProductModal(): void {
    this.showProductModal = false;
  }

  loadProducts(): void {
    this.loadingProducts = true;
    const params = {
      AgencyId: Number(localStorage.getItem('aid')),
      Name: this.productSearch.name || '',
      BrandName: this.productSearch.brandName || '',
      PageNumber: 1,
      PageSize: 50
    };

    this.visitService.getproductdetails(params).subscribe({
      next: (res: any) => {
        this.products = res?.data || [];
        this.loadingProducts = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loadingProducts = false;
      }
    });
  }

  searchProducts(): void {
    this.loadProducts();
  }

  clearProductSearch(): void {
    this.productSearch = { name: '', brandName: '' };
    this.loadProducts();
  }

  toggleProduct(product: any): void {
    const index = this.selectedProducts.findIndex(x => x.productId === product.productId);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(product);
    }
  }

  isSelected(productId: number): boolean {
    return this.selectedProducts.some(x => x.productId === productId);
  }

  saveProducts(): void {
    if (this.currentPlace) {
      this.currentPlace.selectedProducts = [...this.selectedProducts];
      this.currentPlace.productIds = this.selectedProducts.map((x: any) => x.productId);
    }
    this.showProductModal = false;
  }

  // =====================================
  // SAVE / REMOVE CUSTOMER VISIT
  // =====================================
  saveCustomerVisit(): void {
    if (!this.currentPlace.customerId) {
      Swal.fire('Validation', 'Please select a customer', 'warning');
      return;
    }

    if (!this.currentPlace.plannedTime) {
      Swal.fire('Validation', 'Please select a planned time', 'warning');
      return;
    }

    // Optional Products Guard: Ensure product arrays are initialized even if no products were selected
    this.currentPlace.productIds = this.currentPlace.productIds || [];
    this.currentPlace.selectedProducts = this.currentPlace.selectedProducts || [];

    const customer = this.customerList.find((x: any) => x.customerId === this.currentPlace.customerId);
    this.currentPlace.customerName = customer?.name || customer?.customerName || customer?.fullName || '';

    this.assignVisit.places.push({ ...this.currentPlace });
    this.showCustomerModal = false;
  }

  removePlace(index: number): void {
    Swal.fire({
      title: 'Remove Visit?',
      text: 'Do you want to remove this customer visit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this.assignVisit.places.splice(index, 1);
        // Recalculate sequence numbers after removal
        this.assignVisit.places.forEach((place: any, i: number) => {
          place.sequenceNo = i + 1;
        });
      }
    });
  }

  // =====================================
  // SUBMIT VISIT & RESET
  // =====================================
  submitVisit(): void {
    if (!this.assignVisit.mrId) {
      Swal.fire('Validation', 'Please select MR', 'warning');
      return;
    }

    if (!this.assignVisit.visitDate) {
      Swal.fire('Validation', 'Please select visit date', 'warning');
      return;
    }

    if (!this.assignVisit.places || this.assignVisit.places.length === 0) {
      Swal.fire('Validation', 'Please add at least one customer visit', 'warning');
      return;
    }

    const payload = {
      agencyId: Number(localStorage.getItem('aid')),
      mrId: this.assignVisit.mrId,
      assignedBy: Number(localStorage.getItem('mid')),
      visitDate: this.assignVisit.visitDate,
      routeId: this.assignVisit.routeId,   // <-- Add this
      remarks: this.assignVisit.remarks,
      places: this.assignVisit.places.map((place: any) => ({
        customerId: place.customerId,
        doctorId: null,
        plannedTime: place.plannedTime,
        sequenceNo: Number(place.sequenceNo),
        remarks: place.remarks || '',
        productIds: place.productIds || [] // Defaults to empty array [] when no products are picked
      }))
    };

    this.isSubmitting = true;

    this.visitService.assign_visit(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Visit Assigned Successfully'
        });
        this.resetForm();
      },
      error: (err: any) => {
        console.error('Error assigning visit:', err);
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Failed to assign visit'
        });
      }
    });
  }

  resetForm(): void {
    this.assignVisit = {
      agencyId: Number(localStorage.getItem('aid')),
      mrId: null,
      routeId: null,
      assignedBy: Number(localStorage.getItem('mid')),
      visitDate: '',
      remarks: '',
      places: []
    };
    this.routeList = [];
    this.customerList = [];
    this.currentPlace = null;
    this.selectedProducts = [];
    this.products = [];
    this.showCustomerModal = false;
    this.showProductModal = false;
  }
}