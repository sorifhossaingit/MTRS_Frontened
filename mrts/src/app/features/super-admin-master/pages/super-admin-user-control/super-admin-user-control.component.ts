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
  CreditCard,
  Layers,
  Calendar,
  CalendarCheck,
  Users,
  Activity,
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

  // 🔷 Icons
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

  // 🔷 Loading
  isSaving = false;

  // 🔷 Form Model
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
    private superAdminService: SuperAdminMasterService
  ) { }

  // ============================================
  // SAVE COMPANY
  // ============================================

  saveCompany() {

  // 🔴 Validation

  if (!this.company.companyName.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Company name is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.agencyEmail.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Agency email is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.agencyPhone.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Agency phone is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.address.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Address is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.gstNumber.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'GST number is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.licenseNo.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'License number is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.state.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'State is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.city.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'City is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.adminName.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Admin name is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.adminEmail.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Admin email is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  if (!this.company.adminMobile.trim()) {

    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Admin mobile is required',
      confirmButtonColor: '#f59e0b'
    });

    return;
  }

  // 🔷 Decode Token

  let createdBy = 0;

  const token = localStorage.getItem('token');

  if (token) {

    const decodedToken: any = jwtDecode(token);

    createdBy = Number(
      decodedToken?.nameid ||
      decodedToken?.sub ||
      decodedToken?.userId
    );
  }

  // 🔷 Payload

  const payload = {

    companyName: this.company.companyName,

    agencyEmail: this.company.agencyEmail,

    agencyPhone: this.company.agencyPhone,

    address: this.company.address,

    gstNumber: this.company.gstNumber,

    licenseNo: this.company.licenseNo,

    state: this.company.state,

    city: this.company.city,

    adminName: this.company.adminName,

    adminEmail: this.company.adminEmail,

    adminMobile: this.company.adminMobile,

    createdBy: createdBy

  };

  console.log(payload);

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

      next: (res: any) => {

        this.isSaving = false;

        if (res.success) {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Company Added Successfully',
            confirmButtonColor: '#16a34a'
          });

          // Reset Form

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

      },

      error: (err: any) => {

        this.isSaving = false;

        console.log(err);

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

}
