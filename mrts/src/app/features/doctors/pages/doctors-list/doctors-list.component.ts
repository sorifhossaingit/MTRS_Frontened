import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';

import { Save, UserPlus } from 'lucide-angular';

import {
  ArrowLeft,
  User,
  GraduationCap,
  Stethoscope,
  Phone,
  Mail,
  Building,
  Building2,
  Hospital,
  Clock,
  Calendar,
  CalendarCheck,
  BarChart3,
  Layers,
  TrendingUp,
  FileText,
  Repeat,
  Smile,
  UserCheck,
  MapPin
} from 'lucide-angular';
import { DoctorService } from '../../services/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent implements OnInit {

  // =====================================================
  // 🔷 ICONS
  // =====================================================

  User = User;
  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  Phone = Phone;
  Mail = Mail;
  Building = Building;
  Clock = Clock;
  Calendar = Calendar;
  CalendarCheck = CalendarCheck;
  Repeat = Repeat;
  GraduationCap = GraduationCap;
  Stethoscope = Stethoscope;
  BarChart3 = BarChart3;
  Layers = Layers;
  TrendingUp = TrendingUp;
  FileText = FileText;
  Save = Save;
  Building2 = Building2;
  Smile = Smile;
  UserCheck = UserCheck;
  MapPin = MapPin;
  Hospital = Hospital;

  // =====================================================
  // 🔷 FORM
  // =====================================================

  doctorForm!: FormGroup;

  submitted = false;

  // =====================================================
  // 🔷 USER DATA
  // =====================================================

  agencyId: any = localStorage.getItem('aid');

  createdBy: any;

  // =====================================================
  // 🔷 AM LIST
  // =====================================================

  areaManagerList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router
  ) { }

  // =====================================================
  // 🔷 INIT
  // =====================================================

  ngOnInit(): void {

    this.getUserIdFromToken();

    this.initializeForm();

    this.getAreaManagerList();
  }

  getAreaManagerList() {

    this.doctorService
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

  // =====================================================
  // 🔷 INITIALIZE FORM
  // =====================================================

  initializeForm() {

    this.doctorForm = this.fb.group({

      agencyId: [this.agencyId],

      name: [
        '',
        Validators.required
      ],

      qualification: [
        '',
        Validators.required
      ],

      specialization: [
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

      clinicName: [
        '',
        Validators.required
      ],

      hospitalName: [''],

      address: [
        '',
        Validators.required
      ],

      category: [
        '',
        Validators.required
      ],

      potentialScore: [
        '',
        Validators.required
      ],

      assignedAM: [
        '',
        Validators.required
      ],

      lastVisit: [
        '',
        Validators.required
      ],

      nextVisit: [
        '',
        Validators.required
      ],

      createdBy: [0],

      visitingHours: [
        '',
        Validators.required
      ],

      weeklyOffDay: [
        '',
        Validators.required
      ],

      prescriptionType: [
        '',
        Validators.required
      ],

      doctorBehaviour: [
        '',
        Validators.required
      ]

    });

  }

  // =====================================================
  // 🔷 TOKEN DECODE
  // =====================================================

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

  // =====================================================
  // 🔷 SAVE DOCTOR
  // =====================================================

  saveDoctor() {

    this.submitted = true;

    // 🔴 SHOW ALL ERRORS
    if (this.doctorForm.invalid) {

      this.doctorForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
        confirmButtonColor: '#f59e0b'
      });

      return;

    }

    // 🔷 PAYLOAD
    const payload = {

      ...this.doctorForm.value,

      agencyId: this.agencyId,

      createdBy: this.createdBy

    };

    console.log(payload);

    // 🔷 API CALL
    this.doctorService
      .adddoctor(payload)
      .subscribe({

        next: (res: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Doctor Added Successfully',
            confirmButtonColor: '#16a34a'
          }).then(() => {

            this.doctorForm.reset();

            this.router.navigate([
              '/doctor-master/doctor-master-dashboard'
            ]);

          });

        },

        error: (err: any) => {

          console.log(err);

          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text:
              err?.error?.message ||
              'Failed to add doctor',
            confirmButtonColor: '#dc2626'
          });

        }

      });

  }

  // =====================================================
  // 🔷 FORM CONTROLS
  // =====================================================

  get f() {

    return this.doctorForm.controls;

  }

}
