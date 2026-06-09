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
    assignedBy: Number(localStorage.getItem('mid')),
    visitDate: '',
    remarks: '',
    places: []
  };

  // Dropdown Data
  mrList: any[] = [];
  customerList: any[] = [];
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

  constructor(
    private visitService: VisitService
  ) { }

  ngOnInit(): void {
    this.loadMRs();
    this.loadCustomers();
  }

  // =====================================
  // LOAD MRS
  // =====================================

  loadMRs(): void {

    const params = {
      assignedAreaManager:Number(localStorage.getItem('mid')),
      agencyId: Number(localStorage.getItem('aid'))
    };

    this.visitService.get_mrs(params).subscribe({
      next: (res: any) => {

        this.mrList = res?.data || [];

      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  // =====================================
  // LOAD CUSTOMERS
  // =====================================

  loadCustomers(): void {

    const params = {
      assignedAreaManager:Number(localStorage.getItem('mid')),
      agencyId: Number(localStorage.getItem('aid'))
    };

    this.visitService.get_customers(params).subscribe({
      next: (res: any) => {

        this.customerList = res?.data || [];

      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  // =====================================
  // CUSTOMER VISIT MODAL
  // =====================================

  openCustomerModal(): void {

    this.currentPlace = {
      customerId: null,
      customerName: '',
      doctorId: null,
      plannedTime: '',
      sequenceNo: this.assignVisit.places.length + 1,
      remarks: '',
      productIds: [],
      selectedProducts: []
    };

    this.selectedProducts = [];

    this.showCustomerModal = true;
  }

  closeCustomerModal(): void {

    this.showCustomerModal = false;

  }

  // =====================================
  // PRODUCT MODAL
  // =====================================

  openProductModal(): void {

    this.selectedProducts = [
      ...(this.currentPlace?.selectedProducts || [])
    ];

    this.showProductModal = true;

    this.loadProducts();
  }

  closeProductModal(): void {

    this.showProductModal = false;

  }

  // =====================================
  // PRODUCT SEARCH
  // =====================================

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

        console.error(err);

        this.loadingProducts = false;

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

  // =====================================
  // PRODUCT SELECTION
  // =====================================

  toggleProduct(product: any): void {

    const index = this.selectedProducts.findIndex(
      x => x.productId === product.productId
    );

    if (index > -1) {

      this.selectedProducts.splice(index, 1);

    } else {

      this.selectedProducts.push(product);

    }

  }

  isSelected(productId: number): boolean {

    return this.selectedProducts.some(
      x => x.productId === productId
    );

  }

  saveProducts(): void {

    this.currentPlace.selectedProducts = [
      ...this.selectedProducts
    ];

    this.currentPlace.productIds =
      this.selectedProducts.map(
        (x: any) => x.productId
      );

    this.showProductModal = false;

  }

  // =====================================
  // SAVE CUSTOMER VISIT
  // =====================================

  saveCustomerVisit(): void {

    if (!this.currentPlace.customerId) {

      Swal.fire(
        'Validation',
        'Please select customer',
        'warning'
      );

      return;
    }

    if (!this.currentPlace.plannedTime) {

      Swal.fire(
        'Validation',
        'Please select planned time',
        'warning'
      );

      return;
    }

    if (
      !this.currentPlace.productIds ||
      this.currentPlace.productIds.length === 0
    ) {

      Swal.fire(
        'Validation',
        'Please select at least one product',
        'warning'
      );

      return;
    }

    const customer = this.customerList.find(
      (x: any) =>
        x.customerId === this.currentPlace.customerId
    );

    this.currentPlace.customerName =
      customer?.name ||
      customer?.customerName ||
      customer?.fullName ||
      '';

    this.assignVisit.places.push({
      ...this.currentPlace
    });

    this.showCustomerModal = false;
  }

  // =====================================
  // REMOVE CUSTOMER VISIT
  // =====================================

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

      }

    });

  }

  // =====================================
  // HELPERS
  // =====================================

  getCustomerName(customerId: number): string {

    const customer = this.customerList.find(
      (x: any) => x.customerId === customerId
    );

    return (
      customer?.name ||
      customer?.customerName ||
      customer?.fullName ||
      'Customer'
    );

  }

  getMrName(mrId: number): string {

    const mr = this.mrList.find(
      (x: any) => x.mrId === mrId
    );

    return (
      mr?.name ||
      mr?.mrName ||
      ''
    );

  }

  // =====================================
  // SUBMIT VISIT
  // =====================================

  submitVisit(): void {

    if (!this.assignVisit.mrId) {

      Swal.fire(
        'Validation',
        'Please select MR',
        'warning'
      );

      return;
    }

    if (!this.assignVisit.visitDate) {

      Swal.fire(
        'Validation',
        'Please select visit date',
        'warning'
      );

      return;
    }

    if (
      !this.assignVisit.places ||
      this.assignVisit.places.length === 0
    ) {

      Swal.fire(
        'Validation',
        'Please add at least one customer visit',
        'warning'
      );

      return;
    }

    const payload = {

      agencyId:
        Number(localStorage.getItem('aid')),

      mrId:
        this.assignVisit.mrId,

      assignedBy:
        Number(localStorage.getItem('mid')),

      visitDate:
        this.assignVisit.visitDate,

      remarks:
        this.assignVisit.remarks,

      places:
        this.assignVisit.places.map(
          (place: any) => ({

            customerId:
              place.customerId,

            doctorId:
              null,

            plannedTime:
              place.plannedTime,

            sequenceNo:
              Number(place.sequenceNo),

            remarks:
              place.remarks,

            productIds:
              place.productIds

          })
        )

    };

    console.log(
      'Assign Visit Payload',
      payload
    );

    this.isSubmitting = true;

    this.visitService
      .assign_visit(payload)
      .subscribe({

        next: (res: any) => {

          this.isSubmitting = false;

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Visit Assigned Successfully'
          });

          this.resetForm();

        },

        error: (err: any) => {

          console.error(err);

          this.isSubmitting = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.message ||
              'Failed to assign visit'
          });

        }

      });

  }

  // =====================================
  // RESET
  // =====================================

  resetForm(): void {

    this.assignVisit = {
      agencyId: Number(localStorage.getItem('aid')),
      mrId: null,
      assignedBy: Number(localStorage.getItem('mid')),
      visitDate: '',
      remarks: '',
      places: []
    };

    this.currentPlace = null;

    this.selectedProducts = [];

    this.products = [];

    this.showCustomerModal = false;

    this.showProductModal = false;

  }

}
