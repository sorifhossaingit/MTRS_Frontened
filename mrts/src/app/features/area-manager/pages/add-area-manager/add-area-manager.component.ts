import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  UserPlus,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Save
} from 'lucide-angular';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { AreaManagerService } from '../../services/area-manager.service';

@Component({
  selector: 'app-add-area-manager',
  templateUrl: './add-area-manager.component.html',
  styleUrl: './add-area-manager.component.css'
})
export class AddAreaManagerComponent implements OnInit {

  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  User = User;
  Mail = Mail;
  Phone = Phone;
  MapPin = MapPin;
  Calendar = Calendar;
  Building = Building;
  Save = Save;

  submitted = false;
  isSaving = false;
  areaManagerForm: FormGroup;

  agencyId: number =
    Number(localStorage.getItem('aid')) || 0;

  userId: number = 0;

  today: string = '';

  constructor(
    private fb: FormBuilder,
    private areaManagerService: AreaManagerService,
    private router: Router
  ) {

    this.areaManagerForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      gender: [
        '',
        Validators.required
      ],

      dateOfBirth: [
        '',
        [
          Validators.required,
          this.futureDateValidator.bind(this)
        ]
      ],

      joiningDate: [
        '',
        [
          Validators.required,
          this.futureDateValidator.bind(this)
        ]
      ],

      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/)
        ]
      ],

      region: [
        '',
        Validators.required
      ],

      assignedArea: [
        '',
        Validators.required
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
      ]
    });

  }


  ngOnInit(): void {

    this.decodeToken();
    const now = new Date();

    this.today =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  }

  decodeToken() {

    const token = localStorage.getItem('token');

    if (token) {

      const decoded: any = jwtDecode(token);

      this.userId =
        decoded?.userId ||
        decoded?.UserId ||
        decoded?.id ||
        0;

    }

  }

  get f() {
    return this.areaManagerForm.controls;
  }

  saveAreaManager() {

    this.submitted = true;

    if (this.areaManagerForm.invalid) {

      this.areaManagerForm.markAllAsTouched();
      return;
    }

    // Start loading
    this.isSaving = true;

    const payload = {

      agencyId: this.agencyId,

      name: this.areaManagerForm.value.name,

      email: this.areaManagerForm.value.email,

      gender: this.areaManagerForm.value.gender,

      dateOfBirth:
        this.areaManagerForm.value.dateOfBirth + 'T00:00:00',

      joiningDate:
        this.areaManagerForm.value.joiningDate + 'T00:00:00',

      mobile:
        this.areaManagerForm.value.mobile,

      region:
        this.areaManagerForm.value.region,

      assignedArea:
        this.areaManagerForm.value.assignedArea,

      address:
        this.areaManagerForm.value.address,

      city:
        this.areaManagerForm.value.city,

      state:
        this.areaManagerForm.value.state,

      createdBy:
        this.userId

    };

    this.areaManagerService
      .add_area_manager(payload)
      .subscribe({

        // API SUCCESS
        next: (res: any) => {

          this.isSaving = false;

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Area Manager Added Successfully'
          }).then(() => {

            this.areaManagerForm.reset();
            this.submitted = false;

            this.router.navigate([
              '/area-manager/area-manager-dashboard'
            ]);

          });

        },

        // API ERROR
        error: (err: any) => {

          this.isSaving = false;

          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              err?.error?.message ||
              'Failed To Add Area Manager'
          });

        }

      });

  }

  futureDateValidator(control: any) {

    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      return { futureDate: true };
    }

    return null;
  }
}