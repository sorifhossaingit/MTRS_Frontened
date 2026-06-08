import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  UserCheck,
  Map,
  Route,
  Users,
  Building2,
  BarChart3,
  Target,
  TrendingUp,
  Hash,
  Percent,
  CheckCircle,
  Save
} from 'lucide-angular';
import { MrService } from '../../services/mr.service';

@Component({
  selector: 'app-add-medical-representative',
  templateUrl: './add-medical-representative.component.html',
  styleUrl: './add-medical-representative.component.css'
})
export class AddMedicalRepresentativeComponent implements OnInit {

  // ===========================
  // Lucide Icons
  // ===========================

  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  User = User;
  Phone = Phone;
  Mail = Mail;
  MapPin = MapPin;
  Briefcase = Briefcase;
  Calendar = Calendar;
  UserCheck = UserCheck;
  Map = Map;
  Route = Route;
  Users = Users;
  Building2 = Building2;
  BarChart3 = BarChart3;
  Target = Target;
  TrendingUp = TrendingUp;
  Hash = Hash;
  Percent = Percent;
  CheckCircle = CheckCircle;
  Save = Save;

  // ===========================
  // Form
  // ===========================

  mrForm!: FormGroup;
  submitted = false;

  // ===========================
  // Local Storage Values
  // ===========================

  agencyId = Number(localStorage.getItem('aid'));
  managerId = Number(localStorage.getItem('mid'));

  constructor(
    private fb: FormBuilder,
    private mrService: MrService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.initializeForm();

  }

  // ===========================
  // Initialize Form
  // ===========================

  initializeForm(): void {

    this.mrForm = this.fb.group({

      name: [
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
        [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]
      ],

      region: [
        '',
        Validators.required
      ],

      coverArea: [
        '',
        Validators.required
      ]

    });

  }

  // ===========================
  // Form Getter
  // ===========================

  get f() {
    return this.mrForm.controls;
  }

  // ===========================
  // Add MR
  // ===========================

  saveMr(): void {

    this.submitted = true;

    if (this.mrForm.invalid) {

      this.mrForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.'
      });

      return;
    }

    const payload = {

      agencyId: this.agencyId,

      name: this.mrForm.value.name,

      contactPerson: this.mrForm.value.contactPerson,

      mobile: this.mrForm.value.mobile,

      email: this.mrForm.value.email,

      address: this.mrForm.value.address,

      city: this.mrForm.value.city,

      state: this.mrForm.value.state,

      pincode: this.mrForm.value.pincode,

      region: this.mrForm.value.region,

      assignedAreaManager: this.managerId,

      coverArea: this.mrForm.value.coverArea,

      stockistId: null,

      createdBy: this.managerId

    };

    this.mrService.add_mr(payload).subscribe({

      next: (res: any) => {

        if (res?.success) {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Medical Representative added successfully'
          });

          this.mrForm.reset();

          this.submitted = false;

          this.mrForm.patchValue({
            name: '',
            contactPerson: '',
            mobile: '',
            email: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            region: '',
            coverArea: ''
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res?.message || 'Failed to add Medical Representative'
          });

        }

      },

      error: (err: any) => {

        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Something went wrong'
        });

      }

    });

  }

  // ===========================
  // Reset Form
  // ===========================

  resetForm(): void {

    this.submitted = false;

    this.mrForm.reset();

  }

 
  

}
