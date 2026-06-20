import { Component, OnInit } from '@angular/core';

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
  X
} from 'lucide-angular';

import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
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

  Users = Users;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  TrendingUp = TrendingUp;
  Plus = Plus;
  Upload = Upload;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;
  X = X;

  // =========================================================
  // 🔷 VARIABLES
  // =========================================================

  agencyId: any = localStorage.getItem('aid');

  updatedBy: any;

  submitted = false;

  showEditModal = false;

  customerForm!: FormGroup;

  customerList: any[] = [];

  areaManagerList: any[] = [];

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

  typeFilter = '';

  statusFilter = '';

  stateFilter = '';

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

    this.getCustomerDetails();

    this.getAreaManagerList();

  }

  // =========================================================
  // 🔷 FORM INIT
  // =========================================================

  initializeForm() {

    this.customerForm = this.fb.group({

      customerId: [0],

      agencyId: [this.agencyId],

      name: [
        '',
        Validators.required
      ],

      type: [
        '',
        Validators.required
      ],

      registrationNo: [''],

      contactPerson: [
        '',
        Validators.required
      ],

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

      address: [
        '',
        Validators.required
      ],

      city: [
        '',
        Validators.required
      ],

      state: [
        '',
        Validators.required
      ],

      pincode: [
        '',
        Validators.required
      ],

      gstNo: [''],

      drugLicenseNo: [''],

      panNo: [''],

      assignedAreaManager: [
        '',
        Validators.required
      ],

      region: [''],

      landline: [''],

      isActive: [true],


      updatedBy: [0]

    });

  }

  // =========================================================
  // 🔷 TOKEN DECODE
  // =========================================================

  getUserIdFromToken() {

    const token =
      localStorage.getItem('token');

    if (token) {

      const decodedToken: any =
        jwtDecode(token);

      this.updatedBy =
        decodedToken?.userId ||
        decodedToken?.UserId ||
        decodedToken?.id;

    }

  }

  // =========================================================
  // 🔷 AREA MANAGER LIST
  // =========================================================

  getAreaManagerList() {

    this.customerService
      .getAreamanagerlist(this.agencyId)
      .subscribe({

        next: (res: any) => {

          this.areaManagerList =
            res.data || [];

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =========================================================
  // 🔷 DASHBOARD DETAILS
  // =========================================================

  getDashboardDetails() {

    const params = {

      agencyId: this.agencyId

    };

    this.customerService
      .getcustomerdashboarddetails(params)
      .subscribe({

        next: (res: any) => {

          this.totalCustomer =
            res?.totalCustomers || 0;

          this.activeCustomer =
            res?.activeCustomers || 0;

          this.inactiveCustomer =
            res?.inactiveCustomers || 0;

          this.newCustomer =
            res?.newCustomersThisMonth || 0;

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =========================================================
  // 🔷 CUSTOMER DETAILS
  // =========================================================

  getCustomerDetails() {

    const params = {

      agencyId: this.agencyId,

      search: this.searchText,

      type: this.typeFilter,

      status: this.statusFilter,

      state: this.stateFilter,

      pageNumber: this.pageNumber,

      pageSize: this.pageSize

    };

    this.customerService
      .getcustomerdetails(params)
      .subscribe({

        next: (res: any) => {

          this.customerList =
            res?.data || [];

          this.totalRecords =
            res?.totalRecords || 0;

          this.totalPages =
            res?.totalPages || 0;

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =========================================================
  // 🔷 RESET FILTER
  // =========================================================

  resetFilter() {

    this.searchText = '';

    this.typeFilter = '';

    this.statusFilter = '';

    this.stateFilter = '';

    this.pageNumber = 1;

    this.getCustomerDetails();

  }

  // =========================================================
  // 🔷 EDIT CUSTOMER
  // =========================================================

  editCustomer(data: any) {

    this.showEditModal = true;

    this.customerForm.patchValue({

      customerId: data.customerId,

      agencyId: this.agencyId,

      name: data.name,

      type: data.type,

      registrationNo: data.registrationNo,

      contactPerson: data.contactPerson,

      mobile: data.mobile,

      email: data.email,

      address: data.address,

      city: data.city,

      state: data.state,

      pincode: data.pincode,

      gstNo: data.gstNo,

      drugLicenseNo: data.drugLicenseNo,

      panNo: data.panNo,

      assignedAreaManager:
        data.assignedAreaManager,

      region: data.region,

      landline: data.landline,

      isActive: data.isActive,

      updatedBy: this.updatedBy

    });

  }

  // =========================================================
  // 🔷 UPDATE CUSTOMER
  // =========================================================

  updateCustomer() {

    this.submitted = true;

    if (this.customerForm.invalid) {

      this.customerForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
        confirmButtonColor: '#f59e0b'
      });

      return;

    }

    const formValue =
      this.customerForm.value;

    const payload = {

      customerId:
        formValue.customerId,

      agencyId:
        this.agencyId,

      name:
        formValue.name,

      type:
        formValue.type,

      registrationNo:
        formValue.registrationNo,

      contactPerson:
        formValue.contactPerson,

      mobile:
        formValue.mobile,

      email:
        formValue.email,

      address:
        formValue.address,

      city:
        formValue.city,

      state:
        formValue.state,

      pincode:
        formValue.pincode,

      gstNo:
        formValue.gstNo,

      drugLicenseNo:
        formValue.drugLicenseNo,

      panNo:
        formValue.panNo,

      assignedAreaManager:
        Number(
          formValue.assignedAreaManager
        ),

      region: formValue.region,

      landline:
        formValue.landline,

      isActive: formValue.isActive,

      updatedBy:
        this.updatedBy

    };

    this.customerService
      .updatecustomerdetails(payload)
      .subscribe({

        next: (res: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Customer Updated Successfully',
            confirmButtonColor: '#16a34a'
          });

          this.showEditModal = false;

          this.getCustomerDetails();
          this.getDashboardDetails();

        },

        error: (err: any) => {

          console.log(err);

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

  closeModal() {

    this.showEditModal = false;

    this.submitted = false;

  }

  // =========================================================
  // 🔷 PAGINATION
  // =========================================================

  nextPage() {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;

      this.getCustomerDetails();

    }

  }

  previousPage() {

    if (this.pageNumber > 1) {

      this.pageNumber--;

      this.getCustomerDetails();

    }

  }

  changePageSize(event: any) {

    this.pageSize = +event.target.value;

    this.pageNumber = 1;

    this.getCustomerDetails();

  }


  // =========================================================
  // 🔷 DELETE CUSTOMER
  // =========================================================

  deleteCustomer(item: any) {

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

      const payload = {

        customerId: item.customerId,

        agencyId: this.agencyId,

        name: item.name,

        type: item.type,

        registrationNo: item.registrationNo,

        contactPerson: item.contactPerson,

        mobile: item.mobile,

        email: item.email,

        address: item.address,

        city: item.city,

        state: item.state,

        pincode: item.pincode,

        gstNo: item.gstNo,

        drugLicenseNo: item.drugLicenseNo,

        panNo: item.panNo,

        assignedAreaManager:
          Number(item.assignedAreaManager || 0),

        region: item.region,

        landline: item.landline,

        updatedBy: this.updatedBy,

        isActive: false

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

            console.log(err);

            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text:
                err?.error?.message ||
                'Something went wrong',
              confirmButtonColor: '#dc2626'
            });

          }

        });

    });

  }

  // =========================================================
  // 🔷 FORM CONTROLS
  // =========================================================

  get f() {

    return this.customerForm.controls;

  }

}
