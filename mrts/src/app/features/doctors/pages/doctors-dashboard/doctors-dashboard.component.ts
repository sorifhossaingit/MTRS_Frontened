import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Stethoscope,
  Trash2,
  Users,
  X
} from 'lucide-angular';
import { DoctorService } from '../../services/doctor.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-doctors-dashboard',
  templateUrl: './doctors-dashboard.component.html',
  styleUrl: './doctors-dashboard.component.css'
})
export class DoctorsDashboardComponent implements OnInit {

  // =========================================================
  // 🔷 Icons
  // =========================================================

  Stethoscope = Stethoscope;
  Users = Users;
  Activity = Activity;
  Calendar = Calendar;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;
  X = X;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  constructor(
    private router: Router,
    private doctorService: DoctorService,
    private fb: FormBuilder
  ) { }

  // =========================================================
  // 🔷 Local Storage Data
  // =========================================================

  agencyId: any = localStorage.getItem('aid');

  userId: any;

  // =========================================================
  // 🔷 Dashboard Summary
  // =========================================================

  totalDoctors = 0;
  activeDoctors = 0;
  categoryA = 0;
  todayVisits = 0;

  // =========================================================
  // 🔷 Search & Filter
  // =========================================================

  searchText: string = '';

  filterCategory: string = '';

  // =========================================================
  // 🔷 Doctor List
  // =========================================================

  doctors: any[] = [];

  // =========================================================
  // 🔷 Pagination
  // =========================================================

  currentPage: number = 1;

  pageSize: number = 10;

  totalRecords: number = 0;

  totalPages: number = 0;

  // =========================================================
  // 🔷 Modal
  // =========================================================

  showEditModal = false;

  submitted = false;

  // =========================================================
  // 🔷 Form
  // =========================================================

  editDoctorForm!: FormGroup;

  // =========================================================
  // 🔷 INIT
  // =========================================================

  ngOnInit(): void {

    this.getUserIdFromToken();

    this.initializeForm();

    this.loadDashboardSummary();

    this.loadDoctors();

  }

  // =========================================================
  // 🔷 INIT FORM
  // =========================================================

  initializeForm() {

    this.editDoctorForm = this.fb.group({

      doctorId: [0],

      agencyId: [this.agencyId],

      name: ['', Validators.required],

      qualification: ['', Validators.required],

      specialization: ['', Validators.required],

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

      clinicName: ['', Validators.required],

      hospitalName: [''],

      address: ['', Validators.required],

      category: ['', Validators.required],

      potentialScore: [
        '',
        Validators.required
      ],

      assignedMr: [
        '',
        Validators.required
      ],

      lastVisit: ['', Validators.required],

      nextVisit: ['', Validators.required],

      updatedBy: [0],

      isActive: [true],

      visitingHours: ['', Validators.required],

      weeklyOffDay: ['', Validators.required],

      prescriptionType: ['', Validators.required],

      doctorBehaviour: ['', Validators.required]

    });

  }

  // =========================================================
  // 🔷 TOKEN DECODE
  // =========================================================

  getUserIdFromToken() {

    const token = localStorage.getItem('token');

    if (token) {

      const decodedToken: any = jwtDecode(token);

      console.log(decodedToken);

      this.userId =
        decodedToken?.userId ||
        decodedToken?.UserId ||
        decodedToken?.id;

    }

  }

  // =========================================================
  // 🔷 DASHBOARD SUMMARY
  // =========================================================

  loadDashboardSummary() {

    this.doctorService
      .getdoctordashboradsummery(this.agencyId)
      .subscribe({

        next: (res: any) => {

          this.totalDoctors =
            res.totalDoctors || 0;

          this.activeDoctors =
            res.activeDoctors || 0;

          this.categoryA =
            res.categoryA || 0;

          this.todayVisits =
            res.todayVisits || 0;

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =========================================================
  // 🔷 LOAD DOCTORS API
  // =========================================================

  loadDoctors() {

    const params = {

      agencyId: this.agencyId,

      search: this.searchText,

      category: this.filterCategory,

      pageNumber: this.currentPage,

      pageSize: this.pageSize

    };

    this.doctorService
      .getdoctordetails(params)
      .subscribe({

        next: (res: any) => {

          this.doctors = res.data || [];

          this.totalRecords =
            res.totalRecords || 0;

          this.totalPages =
            Math.ceil(
              this.totalRecords / this.pageSize
            );

        },

        error: (err: any) => {

          console.log(err);

        }

      });

  }

  // =========================================================
  // 🔷 SEARCH
  // =========================================================

  onSearch() {

    this.currentPage = 1;

    this.loadDoctors();

  }

  // =========================================================
  // 🔷 CATEGORY FILTER
  // =========================================================

  onCategoryChange() {

    this.currentPage = 1;

    this.loadDoctors();

  }

  // =========================================================
  // 🔷 PAGINATION
  // =========================================================

  nextPage() {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.loadDoctors();

    }

  }

  prevPage() {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.loadDoctors();

    }

  }

  goToPage(page: number) {

    this.currentPage = page;

    this.loadDoctors();

  }

  get pages(): number[] {

    return Array(
      this.totalPages
    ).fill(0).map((x, i) => i + 1);

  }

  // =========================================================
  // 🔷 VIEW
  // =========================================================

  viewDoctor(id: number) {

    this.router.navigate([
      '/doctors/profile',
      id
    ]);

  }

  // =========================================================
  // 🔷 EDIT OPEN MODAL
  // =========================================================

  editDoctor(doc: any) {

    this.showEditModal = true;

    this.editDoctorForm.patchValue({

      doctorId: doc.id,

      agencyId: this.agencyId,

      name: doc.name,

      qualification: doc.qualification,

      specialization: doc.specialization,

      mobile: doc.mobile,

      email: doc.email,

      clinicName: doc.clinicName,

      hospitalName: doc.hospitalName,

      address: doc.address,

      category: doc.category,

      potentialScore: doc.potentialScore,

      assignedMr: doc.assignedMr,

      lastVisit: this.formatDate(doc.lastVisit),

      nextVisit: this.formatDate(doc.nextVisit),

      updatedBy: this.userId,

      isActive: doc.isActive,

      visitingHours: doc.visitingHours,

      weeklyOffDay: doc.weeklyOffDay,

      prescriptionType: doc.prescriptionType,

      doctorBehaviour: doc.doctorBehaviour

    });

  }

  // =========================================================
  // 🔷 UPDATE DOCTOR
  // =========================================================

  updateDoctor() {

    this.submitted = true;

    if (this.editDoctorForm.invalid) {

      this.editDoctorForm.markAllAsTouched();

      return;

    }

    const payload =
      this.editDoctorForm.value;

    this.doctorService
      .updatedoctordetails(payload)
      .subscribe({

        next: (res: any) => {

          alert(
            'Doctor Updated Successfully'
          );

          this.showEditModal = false;

          this.loadDoctors();

          this.loadDashboardSummary();

        },

        error: (err: any) => {

          console.log(err);

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
  // 🔷 DELETE
  // =========================================================

  deleteDoctor(id: number) {

    const confirmDelete = confirm(
      'Are you sure want to delete?'
    );

    if (confirmDelete) {

      this.doctors = this.doctors.filter(
        x => x.id !== id
      );

    }

  }

  // =========================================================
  // 🔷 FORMAT DATE
  // =========================================================

  formatDate(date: any): string {

    if (!date) return '';

    return new Date(date)
      .toISOString()
      .substring(0, 10);

  }

  // =========================================================
  // 🔷 FORM CONTROLS
  // =========================================================

  get f() {

    return this.editDoctorForm.controls;

  }

}