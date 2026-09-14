import { Router } from '@angular/router';
import { Component } from '@angular/core';

import {
  Building2,
  ArrowLeft,
  FileText,
  BadgeCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Save
} from 'lucide-angular';

import { jwtDecode } from 'jwt-decode';
import { SuperAdminMasterService } from '../../services/super-admin-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-super-admin-user-control',
  templateUrl: './super-admin-user-control.component.html',
  styleUrl: './super-admin-user-control.component.css'
})
export class SuperAdminUserControlComponent {

  // =====================================================
  // ICONS
  // =====================================================

  Building2 = Building2;
  ArrowLeft = ArrowLeft;
  FileText = FileText;
  BadgeCheck = BadgeCheck;
  User = User;
  Mail = Mail;
  Phone = Phone;
  MapPin = MapPin;
  Building = Building;
  Globe = Globe;
  Save = Save;


  // =====================================================
  // LOADING
  // =====================================================

  isSaving = false;


  // =====================================================
  // FORM MODEL
  // =====================================================

  company = {

    companyName: '',

    agencyEmail: '',

    agencyPhone: '',

    address: '',

    gstNumber: '',

    licenseNo: '',

    state: '',

    city: '',

    adminName: '',

    adminEmail: '',

    adminMobile: ''

  };


  constructor(
    private superAdminService: SuperAdminMasterService,
    private router: Router
  ) { }


  // =====================================================
  // SAVE COMPANY
  // =====================================================

  saveCompany(): void {

    // ---------------------------------------------
    // Trim all text fields
    // ---------------------------------------------

    this.company.companyName =
      this.company.companyName.trim();

    this.company.agencyEmail =
      this.company.agencyEmail.trim();

    this.company.agencyPhone =
      this.company.agencyPhone.trim();

    this.company.address =
      this.company.address.trim();

    this.company.gstNumber =
      this.company.gstNumber.trim().toUpperCase();

    this.company.licenseNo =
      this.company.licenseNo.trim();

    this.company.state =
      this.company.state.trim();

    this.company.city =
      this.company.city.trim();

    this.company.adminName =
      this.company.adminName.trim();

    this.company.adminEmail =
      this.company.adminEmail.trim();

    this.company.adminMobile =
      this.company.adminMobile.trim();


    // =================================================
    // COMPANY NAME
    // =================================================

    if (!this.company.companyName) {

      this.validationError(
        'Company name is required'
      );

      return;
    }

    if (this.company.companyName.length < 2) {

      this.validationError(
        'Company name must be at least 2 characters'
      );

      return;
    }


    // =================================================
    // AGENCY EMAIL
    // =================================================

    if (!this.company.agencyEmail) {

      this.validationError(
        'Agency email is required'
      );

      return;
    }

    if (!this.isValidEmail(this.company.agencyEmail)) {

      this.validationError(
        'Please enter a valid agency email'
      );

      return;
    }


    // =================================================
    // AGENCY PHONE
    // =================================================

    if (!this.company.agencyPhone) {

      this.validationError(
        'Agency phone is required'
      );

      return;
    }

    if (!this.isValidMobile(this.company.agencyPhone)) {

      this.validationError(
        'Agency phone must be exactly 10 digits'
      );

      return;
    }


    // =================================================
    // ADDRESS
    // =================================================

    if (!this.company.address) {

      this.validationError(
        'Address is required'
      );

      return;
    }

    if (this.company.address.length < 5) {

      this.validationError(
        'Please enter a valid address'
      );

      return;
    }


   // =================================================
// GST - OPTIONAL
// =================================================

if (
  this.company.gstNumber &&
  !this.isValidGST(this.company.gstNumber)
) {

  this.validationError(
    'Please enter a valid GST number'
  );

  return;
}


// =================================================
// LICENSE - OPTIONAL
// =================================================

if (
  this.company.licenseNo &&
  this.company.licenseNo.length < 3
) {

  this.validationError(
    'License number must be at least 3 characters'
  );

  return;
}


    // =================================================
    // STATE
    // =================================================

    if (!this.company.state) {

      this.validationError(
        'State is required'
      );

      return;
    }


    // =================================================
    // CITY
    // =================================================

    if (!this.company.city) {

      this.validationError(
        'City is required'
      );

      return;
    }


    // =================================================
    // ADMIN NAME
    // =================================================

    if (!this.company.adminName) {

      this.validationError(
        'Admin name is required'
      );

      return;
    }


    // =================================================
    // ADMIN EMAIL
    // =================================================

    if (!this.company.adminEmail) {

      this.validationError(
        'Admin email is required'
      );

      return;
    }

    if (!this.isValidEmail(this.company.adminEmail)) {

      this.validationError(
        'Please enter a valid admin email'
      );

      return;
    }


    // =================================================
    // ADMIN MOBILE
    // =================================================

    if (!this.company.adminMobile) {

      this.validationError(
        'Admin mobile is required'
      );

      return;
    }

    if (!this.isValidMobile(this.company.adminMobile)) {

      this.validationError(
        'Admin mobile must be exactly 10 digits'
      );

      return;
    }


    // =================================================
    // DECODE TOKEN
    // =================================================

    let createdBy = 0;

    const token =
      localStorage.getItem('token');

    if (token) {

      try {

        const decodedToken: any =
          jwtDecode(token);

        createdBy = Number(
          decodedToken?.nameid ||
          decodedToken?.sub ||
          decodedToken?.userId ||
          0
        );

      } catch (error) {

        console.error(
          'Token decode failed',
          error
        );

      }

    }


    // =================================================
    // PAYLOAD
    // =================================================

    const payload = {

      companyName:
        this.company.companyName,

      agencyEmail:
        this.company.agencyEmail,

      agencyPhone:
        this.company.agencyPhone,

      address:
        this.company.address,

      gstNumber:
        this.company.gstNumber,

      licenseNo:
        this.company.licenseNo,

      state:
        this.company.state,

      city:
        this.company.city,

      adminName:
        this.company.adminName,

      adminEmail:
        this.company.adminEmail,

      adminMobile:
        this.company.adminMobile,

      createdBy:
        createdBy

    };


    console.log(
      'Create Company Payload:',
      payload
    );


    // =================================================
    // SAVE
    // =================================================

    this.isSaving = true;

    Swal.fire({

      title: 'Creating Company...',

      text: 'Please wait',

      allowOutsideClick: false,

      allowEscapeKey: false,

      didOpen: () => {

        Swal.showLoading();

      }

    });


    this.superAdminService
      .addAgency(payload)
      .subscribe({

        // =============================================
        // SUCCESS
        // =============================================

next: (res: any) => {

  this.isSaving = false;

  Swal.close();

  if (res?.success) {

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Company Added Successfully',
      confirmButtonColor: '#16a34a'
    }).then(() => {

      this.router.navigate([
        '/super-admin-master/super-admin-dashboard'
      ]);

    });

  } else {

    Swal.fire({
      icon: 'error',
      title: 'Failed',
      text:
        res?.message ||
        'Failed to add company',
      confirmButtonColor: '#dc2626'
    });

  }

},


        // =============================================
        // ERROR
        // =============================================

        error: (err: any) => {

          this.isSaving = false;

          Swal.close();

          console.error(
            'Add company error:',
            err
          );

          Swal.fire({

            icon: 'error',

            title: 'Failed',

            text:
              err?.error?.message ||
              'Failed to add company',

            confirmButtonColor: '#dc2626'

          });

        }

      });

  }


  // =====================================================
  // EMAIL VALIDATION
  // =====================================================

  private isValidEmail(
    email: string
  ): boolean {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);

  }


  // =====================================================
  // MOBILE VALIDATION
  // =====================================================

  private isValidMobile(
    mobile: string
  ): boolean {

    return /^[0-9]{10}$/.test(mobile);

  }


  // =====================================================
  // GST VALIDATION
  // =====================================================

  private isValidGST(
    gst: string
  ): boolean {

    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    return gstRegex.test(gst);

  }


  // =====================================================
  // VALIDATION ERROR
  // =====================================================

  private validationError(
    message: string
  ): void {

    Swal.fire({

      icon: 'warning',

      title: 'Validation Error',

      text: message,

      confirmButtonColor: '#f59e0b'

    });

  }


  // =====================================================
  // RESET FORM
  // =====================================================

  private resetForm(): void {

    this.company = {

      companyName: '',

      agencyEmail: '',

      agencyPhone: '',

      address: '',

      gstNumber: '',

      licenseNo: '',

      state: '',

      city: '',

      adminName: '',

      adminEmail: '',

      adminMobile: ''

    };

  }

}

