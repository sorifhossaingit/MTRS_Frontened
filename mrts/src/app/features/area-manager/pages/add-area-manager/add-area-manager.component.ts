import { Component } from '@angular/core';
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

@Component({
  selector: 'app-add-area-manager',
  templateUrl: './add-area-manager.component.html',
  styleUrl: './add-area-manager.component.css'
})
export class AddAreaManagerComponent {

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

  areaManagerForm: FormGroup;

  constructor(private fb: FormBuilder) {

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
        Validators.required
      ],

      joiningDate: [
        '',
        Validators.required
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

  get f() {
    return this.areaManagerForm.controls;
  }

  saveAreaManager() {

    this.submitted = true;

    if (this.areaManagerForm.invalid) {
      return;
    }

    console.log(this.areaManagerForm.value);

    // Call API Here
  }
}