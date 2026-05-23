import { Component, OnInit } from '@angular/core';

import {
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText,
  Users,
  Save
} from 'lucide-angular';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-add-customer-master',
  templateUrl: './add-customer-master.component.html',
  styleUrl: './add-customer-master.component.css'
})
export class AddCustomerMasterComponent implements OnInit {

  // =========================================================
  // 🔷 ICONS
  // =========================================================

  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  User = User;
  Phone = Phone;
  MapPin = MapPin;
  FileText = FileText;
  Users = Users;
  Save = Save;

  // =========================================================
  // 🔷 VARIABLES
  // =========================================================

  customerForm!: FormGroup;

  submitted = false;

  agencyId: any =
    localStorage.getItem('aid');

  createdBy: any;

  areaManagerList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) { }

  // =========================================================
  // 🔷 INIT
  // =========================================================

  ngOnInit(): void {

    this.getUserIdFromToken();

    this.initializeForm();

    this.getAreaManagerList();

  }

  // =========================================================
  // 🔷 FORM
  // =========================================================

  initializeForm() {

    this.customerForm = this.fb.group({

      agencyId: [this.agencyId],

      name: [
        '',
        Validators.required
      ],

      type: [
        '',
        Validators.required
      ],

      registrationNo: [
        '',
        Validators.required
      ],

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

      assignedAreaManager: [0],

      region: [0],

      landline: [''],

      createdBy: [0]

    });

  }

  // =========================================================
  // 🔷 GET AREA MANAGER LIST
  // =========================================================

  getAreaManagerList() {

    this.customerService
      .getAreamanagerlist(this.agencyId)
      .subscribe({

        next: (res: any) => {

          this.areaManagerList = res.data || [];

        },

        error: (err: any) => {

          console.log(err);

        }

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

      this.createdBy =
        decodedToken?.userId ||
        decodedToken?.UserId ||
        decodedToken?.id;

    }

  }

  // =========================================================
  // 🔷 SAVE CUSTOMER
  // =========================================================

  saveCustomer() {

    this.submitted = true;

    if (this.customerForm.invalid) {

      this.customerForm.markAllAsTouched();

      return;

    }

    const formValue =
      this.customerForm.value;

    const payload = {

      agencyId: this.agencyId,

      name: formValue.name,

      type: formValue.type,

      registrationNo:
        formValue.registrationNo,

      contactPerson:
        formValue.contactPerson,

      mobile: formValue.mobile,

      email: formValue.email,

      address: formValue.address,

      city: formValue.city,

      state: formValue.state,

      pincode: formValue.pincode,

      gstNo: formValue.gstNo,

      drugLicenseNo:
        formValue.drugLicenseNo,

      panNo: formValue.panNo,

      assignedAreaManager:
        Number(
          formValue.assignedAreaManager
        ),

      region:
        Number(formValue.region),

      landline:
        formValue.landline,

      createdBy: this.createdBy

    };

    this.customerService
      .addcustomer(payload)
      .subscribe({

        next: (res: any) => {

          alert(
            'Customer Added Successfully'
          );

          this.router.navigate([
            '/customer-master/customer-master-dashboard'
          ]);

        },

        error: (err: any) => {

          console.log(err);

          alert(
            'Something went wrong'
          );

        }

      });

  }

  // =========================================================
  // 🔷 FORM CONTROLS
  // =========================================================

  get f() {

    return this.customerForm.controls;

  }

}
