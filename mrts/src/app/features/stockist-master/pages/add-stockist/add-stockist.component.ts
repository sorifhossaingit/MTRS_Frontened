import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Building2,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building,
  Globe,
  Hash,
  FileText,
  Wallet,
  BadgeIndianRupee,
  Clock,
  Map,
  User,
  Layers,
  CheckCircle,
  Save
} from 'lucide-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { StockistService } from '../../services/stockist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-stockist',
  templateUrl: './add-stockist.component.html',
  styleUrl: './add-stockist.component.css'
})
export class AddStockistComponent implements OnInit {

  // 🔷 Icons
  Building2 = Building2;
  ArrowLeft = ArrowLeft;
  Phone = Phone;
  Mail = Mail;
  MapPin = MapPin;
  Building = Building;
  Globe = Globe;
  Hash = Hash;
  FileText = FileText;
  Wallet = Wallet;
  BadgeIndianRupee = BadgeIndianRupee;
  Clock = Clock;
  Map = Map;
  User = User;
  Layers = Layers;
  CheckCircle = CheckCircle;
  Save = Save;
  // =====================================================
  // FORM
  // =====================================================

  stockistForm!: FormGroup;

  submitted = false;

  isSaving = false;

  // =====================================================
  // STORAGE DATA
  // =====================================================

  agencyId: number = 0;

  createdBy: number = 0;

  // =====================================================
  // AREA MANAGER LIST
  // =====================================================

  areaManagerList: any[] = [];

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private fb: FormBuilder,
    private stockistService: StockistService,
    private router: Router
  ) { }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.agencyId =
      Number(localStorage.getItem('aid'));

    this.decodeToken();

    this.initializeForm();

    this.getAreaManagerList();

  }

  // =====================================================
  // DECODE TOKEN
  // =====================================================

  decodeToken() {

    const token =
      localStorage.getItem('token');

    if (token) {

      const decoded: any =
        jwtDecode(token);

      this.createdBy =
        decoded?.userId ||
        decoded?.UserId ||
        decoded?.id ||
        0;

    }

  }

  // =====================================================
  // FORM
  // =====================================================

  initializeForm() {

    this.stockistForm = this.fb.group({

      name: [
        '',
        Validators.required
      ],

      firmType: [
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
          Validators.pattern('^[0-9]{10}$')
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
        [
          Validators.required,
          Validators.pattern('^[0-9]{6}$')
        ]
      ],

      gstNo: [
        '',
        Validators.required
      ],

      drugLicenseNo: [
        '',
        Validators.required
      ],

      region: [
        '',
        Validators.required
      ],

      assignedAreaManager: [
        '',
        Validators.required
      ],

      coverArea: [
        '',
        Validators.required
      ]

    });

  }

  // =====================================================
  // GET AREA MANAGER LIST
  // =====================================================

  getAreaManagerList() {

    this.stockistService
      .getAreamanagerlist(this.agencyId)
      .subscribe({

        next: (res: any) => {

          this.areaManagerList =
            res?.data || [];

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =====================================================
  // SAVE STOCKIST
  // =====================================================

saveStockist() {

  this.submitted = true;

  if (this.stockistForm.invalid) {

    this.stockistForm.markAllAsTouched();

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please fill all required fields correctly.',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  this.isSaving = true;

  const payload = {
    agencyId: this.agencyId,
    name: this.stockistForm.value.name,
    firmType: this.stockistForm.value.firmType,
    contactPerson: this.stockistForm.value.contactPerson,
    mobile: this.stockistForm.value.mobile,
    email: this.stockistForm.value.email,
    address: this.stockistForm.value.address,
    city: this.stockistForm.value.city,
    state: this.stockistForm.value.state,
    pincode: this.stockistForm.value.pincode,
    gstNo: this.stockistForm.value.gstNo,
    drugLicenseNo: this.stockistForm.value.drugLicenseNo,
    region: this.stockistForm.value.region,
    assignedAreaManager: Number(
      this.stockistForm.value.assignedAreaManager
    ),
    coverArea: this.stockistForm.value.coverArea,
    createdBy: this.createdBy
  };

  this.stockistService.addstockist(payload).subscribe({

    next: (res: any) => {

      this.isSaving = false;

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Stockist Added Successfully',
        confirmButtonColor: '#16a34a'
      }).then(() => {

        this.router.navigate([
          '/stockist-master/stockist-master-dashboard'
        ]);

      });

    },

    error: (err: any) => {

      this.isSaving = false;

      console.log(err);

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text:
          err?.error?.message ||
          'Failed To Add Stockist',
        confirmButtonColor: '#dc2626'
      });

    }

  });

}

  // =====================================================
  // FORM CONTROLS
  // =====================================================

  get f() {

    return this.stockistForm.controls;

  }

}
