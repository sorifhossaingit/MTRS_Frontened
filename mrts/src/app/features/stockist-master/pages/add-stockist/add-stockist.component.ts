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

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { jwtDecode } from 'jwt-decode';

import { StockistService } from '../../services/stockist.service';
import { AreaManagerService } from '../../../area-manager/services/area-manager.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-stockist',
  templateUrl: './add-stockist.component.html',
  styleUrl: './add-stockist.component.css'
})
export class AddStockistComponent implements OnInit {

  // =====================================================
  // ICONS
  // =====================================================

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
  // AREA LIST
  // =====================================================

  areas: any[] = [];

  isLoadingAreas = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private fb: FormBuilder,
    private stockistService: StockistService,
    private areaManagerService: AreaManagerService,
    private router: Router
  ) { }


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    // -----------------------------------------
    // Get Agency ID
    // -----------------------------------------

    this.agencyId =
      Number(localStorage.getItem('aid')) || 0;


    // -----------------------------------------
    // Decode Login User
    // -----------------------------------------

    this.decodeToken();


    // -----------------------------------------
    // Initialize Form
    // -----------------------------------------

    this.initializeForm();


    // -----------------------------------------
    // Load Areas
    // -----------------------------------------

    this.loadAreas();
  }


  // =====================================================
  // DECODE TOKEN
  // =====================================================

  decodeToken(): void {

    const token =
      localStorage.getItem('token');

    if (!token) {

      console.error(
        'Token not found'
      );

      return;
    }

    try {

      const decoded: any =
        jwtDecode(token);

      this.createdBy =
        Number(
          decoded?.userId ||
          decoded?.UserId ||
          decoded?.id ||
          0
        );

      console.log(
        'Created By:',
        this.createdBy
      );

    } catch (error) {

      console.error(
        'JWT decode error:',
        error
      );

      this.createdBy = 0;
    }
  }


  // =====================================================
  // INITIALIZE FORM
  // =====================================================

  initializeForm(): void {

    this.stockistForm =
      this.fb.group({

        // -----------------------------------------
        // Basic Information
        // -----------------------------------------

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


        // -----------------------------------------
        // Contact Details
        // -----------------------------------------

        mobile: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[0-9]{10}$'
            )
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],


        // -----------------------------------------
        // Address
        // -----------------------------------------

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
            Validators.pattern(
              '^[0-9]{6}$'
            )
          ]
        ],


        // -----------------------------------------
        // Licensing
        // -----------------------------------------

        gstNo: [
          '',
          Validators.required
        ],

        drugLicenseNo: [
          '',
          Validators.required
        ],


        // -----------------------------------------
        // Territory
        // -----------------------------------------

        region: [
          '',
          Validators.required
        ],

        // ONLY AREA ID
        areaId: [
          '',
          Validators.required
        ]

      });
  }


  // =====================================================
  // LOAD AREAS
  // =====================================================

  loadAreas(): void {

    const agencyId =
      Number(localStorage.getItem('aid')) || 0;


    // -----------------------------------------
    // Validate Agency
    // -----------------------------------------

    if (agencyId <= 0) {

      console.error(
        'Invalid Agency ID'
      );

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid agency ID'
      });

      return;
    }


    this.isLoadingAreas = true;


    // -----------------------------------------
    // Get Active Areas
    // -----------------------------------------

    this.areaManagerService
      .get_all_area({
        agencyId: agencyId,
        isActive: true
      })
      .subscribe({

        // =====================================
        // SUCCESS
        // =====================================

        next: (res: any) => {

          console.log(
            'Area API Response:',
            res
          );


          this.areas =
            Array.isArray(res?.data)
              ? res.data
              : [];


          console.log(
            'Areas:',
            this.areas
          );


          this.isLoadingAreas = false;
        },


        // =====================================
        // ERROR
        // =====================================

        error: (err: any) => {

          console.error(
            'Area API Error:',
            err
          );


          this.areas = [];

          this.isLoadingAreas = false;


          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load areas',
            confirmButtonColor: '#dc2626'
          });
        }

      });
  }


  // =====================================================
  // SAVE STOCKIST
  // =====================================================

  saveStockist(): void {

    this.submitted = true;


    // -----------------------------------------
    // Validate Form
    // -----------------------------------------

    if (this.stockistForm.invalid) {

      this.stockistForm.markAllAsTouched();


      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text:
          'Please fill all required fields correctly.',
        confirmButtonColor: '#f59e0b'
      });


      return;
    }


    // -----------------------------------------
    // Validate Agency
    // -----------------------------------------

    if (this.agencyId <= 0) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid agency ID',
        confirmButtonColor: '#dc2626'
      });


      return;
    }


    // -----------------------------------------
    // Validate Created By
    // -----------------------------------------

    if (this.createdBy <= 0) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          'Unable to identify logged-in user.',
        confirmButtonColor: '#dc2626'
      });


      return;
    }


    // -----------------------------------------
    // Get Area ID
    // -----------------------------------------

    const areaId =
      Number(
        this.stockistForm.value.areaId
      );


    if (areaId <= 0) {

      Swal.fire({
        icon: 'warning',
        title: 'Area Required',
        text: 'Please select an area.',
        confirmButtonColor: '#f59e0b'
      });


      return;
    }


    // -----------------------------------------
    // Start Saving
    // -----------------------------------------

    this.isSaving = true;


    // ==========================================
    // API PAYLOAD
    // ==========================================

    const payload = {

      agencyId: this.agencyId,

      name:
        this.stockistForm.value.name,

      firmType:
        this.stockistForm.value.firmType,

      contactPerson:
        this.stockistForm.value.contactPerson,

      mobile:
        this.stockistForm.value.mobile,

      email:
        this.stockistForm.value.email,

      address:
        this.stockistForm.value.address,

      city:
        this.stockistForm.value.city,

      state:
        this.stockistForm.value.state,

      pincode:
        this.stockistForm.value.pincode,

      gstNo:
        this.stockistForm.value.gstNo,

      drugLicenseNo:
        this.stockistForm.value.drugLicenseNo,

      region:
        this.stockistForm.value.region,

      // ======================================
      // ONLY AREA ID
      // ======================================

      areaId: areaId,

      createdBy:
        this.createdBy
    };


    console.log(
      'Create Stockist Payload:',
      payload
    );


    // ==========================================
    // CREATE STOCKIST API
    // ==========================================

    this.stockistService
      .addstockist(payload)
      .subscribe({

        // ======================================
        // SUCCESS
        // ======================================

        next: (res: any) => {

          console.log(
            'Create Stockist Response:',
            res
          );


          this.isSaving = false;


          Swal.fire({
            icon: 'success',
            title: 'Success',
            text:
              res?.message ||
              'Stockist Added Successfully',
            confirmButtonColor: '#16a34a'
          })
          .then(() => {

            this.router.navigate([
              '/stockist-master/stockist-master-dashboard'
            ]);

          });
        },


        // ======================================
        // ERROR
        // ======================================

        error: (err: any) => {

          this.isSaving = false;


          console.error(
            'Create Stockist Error:',
            err
          );


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