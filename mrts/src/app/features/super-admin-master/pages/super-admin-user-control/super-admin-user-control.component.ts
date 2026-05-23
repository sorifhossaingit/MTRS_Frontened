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

      alert('Company name is required');

      return;
    }

    if (!this.company.agencyEmail.trim()) {

      alert('Agency email is required');

      return;
    }

    if (!this.company.agencyPhone.trim()) {

      alert('Agency phone is required');

      return;
    }

    if (!this.company.address.trim()) {

      alert('Address is required');

      return;
    }

    if (!this.company.gstNumber.trim()) {

      alert('GST number is required');

      return;
    }

    if (!this.company.licenseNo.trim()) {

      alert('License number is required');

      return;
    }

    if (!this.company.state.trim()) {

      alert('State is required');

      return;
    }

    if (!this.company.city.trim()) {

      alert('City is required');

      return;
    }

    if (!this.company.adminName.trim()) {

      alert('Admin name is required');

      return;
    }

    if (!this.company.adminEmail.trim()) {

      alert('Admin email is required');

      return;
    }

    if (!this.company.adminMobile.trim()) {

      alert('Admin mobile is required');

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

    // 🔷 API CALL

    this.isSaving = true;

    this.superAdminService
      .addAgency(payload)
      .subscribe({

        next: (res: any) => {

          this.isSaving = false;

          console.log(res);

          if (res.success) {

            alert('Company Added Successfully');

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

        error: (err) => {

          this.isSaving = false;

          console.log(err);

          alert('Failed to add company');
        }
      });
  }

}
