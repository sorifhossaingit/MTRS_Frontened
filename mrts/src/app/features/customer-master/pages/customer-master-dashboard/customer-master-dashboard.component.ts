

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators'; // Add finalize import
import {
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  Upload,
  Eye,
  Pencil,
  Trash2,
  X,
  Check
} from 'lucide-angular';

import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-master-dashboard',
  templateUrl: './customer-master-dashboard.component.html',
  styleUrl: './customer-master-dashboard.component.css'
})
export class CustomerMasterDashboardComponent implements OnInit {

  // =========================================================
  // 🔷 ICONS
  // =========================================================

  readonly Users = Users;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly TrendingUp = TrendingUp;
  readonly Plus = Plus;
  readonly Upload = Upload;
  readonly Eye = Eye;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Check = Check;

  // =========================================================
  // 🔷 VARIABLES
  // =========================================================

  agencyId: string | null = localStorage.getItem('aid');
  updatedBy: number = 0;
  rid: string | null = localStorage.getItem('rid');
  submitted = false;
  showEditModal = false;

  customerForm!: FormGroup;

  customerList: any[] = [];
  areaManagerList: any[] = [];
  customerTypeList: any[] = [];
  routeList: any[] = [];

  typeFilter: string | null = null;
  routeFilter: number | null = null;
  statusFilter: boolean | null = null;

  // =========================================================
  // 🔷 DASHBOARD
  // =========================================================

  totalCustomer = 0;
  activeCustomer = 0;
  inactiveCustomer = 0;
  newCustomer = 0;

  // =========================================================
  // 🔷 FILTERS
  // =========================================================

  searchText = '';
  stateFilter = '';

  isLoading = false; // Add this variable to your component`
  // =========================================================
  // 🔷 PAGINATION
  // =========================================================

  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPages = 0;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder
  ) { }

  // =========================================================
  // 🔷 INIT
  // =========================================================

  ngOnInit(): void {
    this.getUserIdFromToken();
    this.initializeForm();
    this.getDashboardDetails();
    this.getCustomerTypeList();
    this.getRouteList();
    this.getCustomerDetails();
    this.getAreaManagerList();
  }

  // =========================================================
  // 🔷 FORM INIT
  // =========================================================

  initializeForm(): void {
    this.customerForm = this.fb.group({
      customerId: [0],
      agencyId: [Number(this.agencyId || 0)],
      name: ['', Validators.required],
      type: ['', Validators.required],
      routeId: [0],
      registrationNo: [''],
      contactPerson: ['', Validators.required],
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', Validators.required],
      gstNo: [''],
      drugLicenseNo: [''],
      panNo: [''],
      assignedAreaManager: [0, Validators.required],
      region: [''],
      landline: [''],
      latitude: [0],
      longitude: [0],
      isActive: [true],
      updatedBy: [this.updatedBy]
    });
  }

  // Helper getter for form controls
  get f() {
    return this.customerForm.controls;
  }

  // =========================================================
  // 🔷 TOKEN DECODE
  // =========================================================

  getUserIdFromToken(): void {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const decodedToken: any = jwtDecode(token);
      this.updatedBy = Number(
        decodedToken?.userId ||
        decodedToken?.UserId ||
        decodedToken?.id ||
        0
      );
    } catch (err) {
      console.error('Invalid or corrupted JWT token:', err);
    }
  }


  // =========================================================
  // 🔷 AREA MANAGER LIST
  // =========================================================

  getAreaManagerList(): void {
    this.customerService
      .getAreamanagerlist(this.agencyId)
      .subscribe({
        next: (res: any) => {
          this.areaManagerList = res.data || [];
        },
        error: (err: any) => {
          console.error('Failed to fetch Area Managers:', err);
        }
      });
  }

  // =========================================================
  // 🔷 ROUTE LIST
  // =========================================================

getRouteList(): void {
  this.customerService
    .getRouteList(this.agencyId)
    .subscribe({
      next: (res: any) => {
        this.routeList = res.data || [];
      },
      error: (err: any) => {
        console.error('Failed to fetch Route List:', err);
      }
    });
}

  // =========================================================
  // 🔷 CUSTOMER TYPE LIST
  // =========================================================

getCustomerTypeList(): void {
  const agencyId = Number(this.agencyId);

  this.customerService.getCustomerTypeList(agencyId).subscribe({
    next: (res: any) => {
      this.customerTypeList = res.data || res || [];
    },
    error: (err: any) => {
      console.error('Failed to fetch Customer Types:', err);
    }
  });
}
  // =========================================================
  // 🔷 DASHBOARD DETAILS
  // =========================================================

  getDashboardDetails(): void {
    const params = {
      agencyId: this.agencyId
    };

    this.customerService
      .getcustomerdashboarddetails(params)
      .subscribe({
        next: (res: any) => {
          this.totalCustomer = res?.totalCustomers || 0;
          this.activeCustomer = res?.activeCustomers || 0;
          this.inactiveCustomer = res?.inactiveCustomers || 0;
          this.newCustomer = res?.newCustomersThisMonth || 0;
        },
        error: (err: any) => {
          console.error('Failed to fetch Dashboard Details:', err);
        }
      });
  }

  // =========================================================
  // 🔷 CUSTOMER DETAILS
  // =========================================================

  getCustomerDetails(): void {
    const rawParams: Record<string, any> = {
      agencyId: this.agencyId,
      pageNumber: this.pageNumber,
      search: this.searchText.trim() || null,
      type: this.typeFilter,
      state: this.stateFilter.trim() || null,
      isActive: this.statusFilter,
      routeId: this.routeFilter,
      createdBy: this.rid === 'a5fabfee-5506-4e12-bfec-c898fc5af3ae' ? null : this.updatedBy
    };

    let params: any = {};
    Object.keys(rawParams).forEach(key => {
      const val = rawParams[key];
      if (val !== null && val !== undefined && val !== '') {
        params[key] = val;
      }
    });

    this.customerService
      .getcustomerdetails(params)
      .subscribe({
        next: (res: any) => {
          this.customerList = res.data || [];
          this.totalRecords = res.totalCount || 0;
          this.pageSize = res.pageSize || 10;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        },
        error: (err: any) => {
          console.error('Failed to fetch Customer Details:', err);
        }
      });
  }

  // =========================================================
  // 🔷 RESET FILTER
  // =========================================================

  resetFilter(): void {
    this.searchText = '';
    this.typeFilter = null;
    this.routeFilter = null;
    this.statusFilter = null;
    this.stateFilter = '';
    this.pageNumber = 1;

    this.getCustomerDetails();
  }

  // =========================================================
  // 🔷 EDIT CUSTOMER
  // =========================================================

  editCustomer(data: any): void {
    this.showEditModal = true;

    // Find ID from customerTypeList if the record only contains the string name
    let typeId = Number(data.customerTypeId || data.typeId || 0);

    if (!typeId && (data.type || data.customerType)) {
      const matchedType = this.customerTypeList.find(
        (item) => item.customerType === (data.type || data.customerType)
      );
      if (matchedType) {
        typeId = Number(matchedType.customerTypeId);
      }
    }

    this.customerForm.patchValue({
      customerId: Number(data.customerId || 0),
      agencyId: Number(this.agencyId || 0),
      name: data.name || '',
      type: typeId, // Sets integer ID (e.g. 13)
      routeId: Number(data.routeId || 0),
      registrationNo: data.registrationNo || '',
      contactPerson: data.contactPerson || '',
      mobile: data.mobile || '',
      email: data.email || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
      gstNo: data.gstNo || '',
      drugLicenseNo: data.drugLicenseNo || '',
      panNo: data.panNo || '',
      assignedAreaManager: Number(data.assignedAreaManager || 0),
      region: data.region || '',
      landline: data.landline || '',
      latitude: Number(data.latitude || 0),
      longitude: Number(data.longitude || 0),
      isActive: data.isActive ?? true,
      updatedBy: this.updatedBy
    });
  }
  // =========================================================
  // 🔷 UPDATE CUSTOMER
  // =========================================================
 updateCustomer(): void {
  this.submitted = true;

  if (this.customerForm.invalid || this.customerForm.value.type === 0) {
    this.customerForm.markAllAsTouched();

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please select a valid Customer Type and complete all required fields.',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  this.isLoading = true; // 🔹 START LOADING

  const formValues = this.customerForm.value;

  const payload = {
    customerId: Number(formValues.customerId || 0),
    agencyId: Number(this.agencyId || 0),
    name: formValues.name,
    type: Number(formValues.type || 0),
    routeId: Number(formValues.routeId || 0),
    registrationNo: formValues.registrationNo,
    contactPerson: formValues.contactPerson,
    mobile: formValues.mobile,
    email: formValues.email,
    address: formValues.address,
    city: formValues.city,
    state: formValues.state,
    pincode: formValues.pincode,
    gstNo: formValues.gstNo,
    drugLicenseNo: formValues.drugLicenseNo,
    panNo: formValues.panNo,
    assignedAreaManager: Number(formValues.assignedAreaManager || 0),
    isActive: formValues.isActive,
    updatedBy: this.updatedBy,
    region: formValues.region,
    landline: formValues.landline,
    latitude: Number(formValues.latitude || 0),
    longitude: Number(formValues.longitude || 0)
  };

  this.customerService.updatecustomerdetails(payload)
    .pipe(
      finalize(() => {
        this.isLoading = false; // 🔹 STOP LOADING (Runs whether call succeeds or fails)
      })
    )
    .subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Customer Updated Successfully',
          confirmButtonColor: '#16a34a'
        });

        this.closeModal();
        this.getCustomerDetails();
        this.getDashboardDetails();
      },
      error: (err: any) => {
        console.error('Update Failed:', err);

        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err?.error?.message || 'Something went wrong',
          confirmButtonColor: '#dc2626'
        });
      }
    });
}
  // =========================================================
  // 🔷 CLOSE MODAL
  // =========================================================

  closeModal(): void {
    this.showEditModal = false;
    this.submitted = false;
    this.customerForm.reset({
      customerId: 0,
      agencyId: Number(this.agencyId || 0),
      routeId: 0,
      assignedAreaManager: 0,
      latitude: 0,
      longitude: 0,
      isActive: true,
      updatedBy: this.updatedBy
    });
  }

  // =========================================================
  // 🔷 PAGINATION
  // =========================================================

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getCustomerDetails();
    }
  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getCustomerDetails();
    }
  }

  changePageSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.pageNumber = 1;
    this.getCustomerDetails();
  }

  // =========================================================
  // 🔷 DELETE CUSTOMER
  // =========================================================

  deleteCustomer(item: any): void {
    Swal.fire({
      title: 'Delete Customer?',
      text: `Are you sure you want to delete ${item.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      // Resolve Customer Type ID
      let typeId = item.customerTypeId || item.typeId || item.type || '';

      // If type is a string name (e.g. "ABC"), resolve its numeric ID from customerTypeList
      if (isNaN(Number(typeId))) {
        const matchedType = this.customerTypeList.find(
          (t: any) => t.customerType === typeId
        );
        if (matchedType) {
          typeId = matchedType.customerTypeId;
        }
      }

      const payload = {
        customerId: Number(item.customerId || 0),
        agencyId: Number(this.agencyId || 0),
        name: item.name || '',
        type: Number(item.type || 0), // API requires type as String (e.g. "14")
        registrationNo: item.registrationNo || '',
        contactPerson: item.contactPerson || '',
        mobile: item.mobile || '',
        email: item.email || '',
        address: item.address || '',
        city: item.city || '',
        state: item.state || '',
        pincode: item.pincode || '',
        gstNo: item.gstNo || '',
        drugLicenseNo: item.drugLicenseNo || '',
        panNo: item.panNo || '',
        assignedAreaManager: Number(item.assignedAreaManager || 0),
        updatedBy: this.updatedBy,
        region: item.region || '',
        landline: item.landline || '',
        latitude: Number(item.latitude || 0),
        longitude: Number(item.longitude || 0),
        routeId: Number(item.routeId || 0),
        isActive: false // Explicitly mark as deleted/inactive
      };

      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.customerService
        .updatecustomerdetails(payload)
        .subscribe({
          next: (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Customer Deleted Successfully',
              confirmButtonColor: '#16a34a'
            });

            this.getCustomerDetails();
            this.getDashboardDetails();
          },
          error: (err: any) => {
            console.error('Delete Failed:', err);

            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: err?.error?.message || err?.error?.title || 'Something went wrong',
              confirmButtonColor: '#dc2626'
            });
          }
        });
    });

  }

  updateCustomerStatus(item: any, status: number): void {

  const action = status === 2 ? 'Approve' : 'Reject';

  Swal.fire({
    title: `${action} Customer?`,
    text: `Are you sure you want to ${action.toLowerCase()} this customer?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonColor: status === 2 ? '#16a34a' : '#dc2626'
  }).then((result) => {

    if (!result.isConfirmed) return;

    const payload = {
      customerId: item.customerId,
      agencyId: this.agencyId,
      status: status,
      approvedBy: this.updatedBy
    };

    this.customerService.updateCustomerStatus(payload).subscribe({
      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Customer ${action.toLowerCase()}d successfully.`,
          confirmButtonColor: '#16a34a'
        });

        this.getCustomerDetails();
        this.getDashboardDetails();
      },
      error: (err: any) => {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Something went wrong.'
        });

        console.error(err);
      }
    });

  });
}
}