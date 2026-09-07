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
  Save,
  ChevronDown,
  Search,
  Check,
  X
} from 'lucide-angular';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { jwtDecode } from 'jwt-decode';

import { AreaManagerService }
  from '../../services/area-manager.service';


// =====================================================
// AREA INTERFACE
// =====================================================

interface Area {

  areaId: number;

  areaUuid: string;

  agencyId: number;

  areaName: string;

  areaCode: string | null;

  description: string | null;

  isActive: boolean;

  createdAt: string;

  updatedAt: string | null;

  createdBy: number | null;

  updatedBy: number | null;

}


// =====================================================
// COMPONENT
// =====================================================

@Component({

  selector: 'app-add-area-manager',

  templateUrl:
    './add-area-manager.component.html',

  styleUrl:
    './add-area-manager.component.css'

})
export class AddAreaManagerComponent
  implements OnInit {


  // ===================================================
  // ICONS
  // ===================================================

  UserPlus = UserPlus;

  ArrowLeft = ArrowLeft;

  User = User;

  Mail = Mail;

  Phone = Phone;

  MapPin = MapPin;

  Calendar = Calendar;

  Building = Building;

  Save = Save;

  ChevronDown = ChevronDown;

  Search = Search;

  Check = Check;

  X = X;



  // ===================================================
  // FORM
  // ===================================================

  submitted = false;

  isSaving = false;

  areaManagerForm: FormGroup;



  // ===================================================
  // AREA DATA
  // ===================================================

  areas: Area[] = [];

  selectedAreas: Area[] = [];

  isLoadingAreas = false;



  // ===================================================
  // AREA DROPDOWN
  // ===================================================

  areaDropdownOpen = false;

  areaSearch = '';



  // ===================================================
  // AGENCY
  // ===================================================

  agencyId: number =
    Number(
      localStorage.getItem('aid')
    ) || 0;



  // ===================================================
  // USER
  // ===================================================

  userId: number = 0;



  // ===================================================
  // TODAY
  // ===================================================

  today: string = '';



  // ===================================================
  // CONSTRUCTOR
  // ===================================================

  constructor(

    private fb: FormBuilder,

    private areaManagerService:
      AreaManagerService,

    private router: Router

  ) {


    // =================================================
    // FORM INITIALIZATION
    // =================================================

    this.areaManagerForm =
      this.fb.group({

        // ---------------------------------------------
        // NAME
        // ---------------------------------------------

        name: [

          '',

          [

            Validators.required,

            Validators.minLength(3)

          ]

        ],



        // ---------------------------------------------
        // EMAIL
        // ---------------------------------------------

        email: [

          '',

          [

            Validators.required,

            Validators.email

          ]

        ],



        // ---------------------------------------------
        // GENDER
        // ---------------------------------------------

        gender: [

          '',

          Validators.required

        ],



        // ---------------------------------------------
        // DOB
        // ---------------------------------------------

        dateOfBirth: [

          '',

          [

            Validators.required,

            this.futureDateValidator
              .bind(this)

          ]

        ],



        // ---------------------------------------------
        // JOINING DATE
        // ---------------------------------------------

        joiningDate: [

          '',

          [

            Validators.required,

            this.futureDateValidator
              .bind(this)

          ]

        ],



        // ---------------------------------------------
        // MOBILE
        // ---------------------------------------------

        mobile: [

          '',

          [

            Validators.required,

            Validators.pattern(
              /^[6-9]\d{9}$/
            )

          ]

        ],



        // ---------------------------------------------
        // REGION
        // ---------------------------------------------

        region: [

          '',

          Validators.required

        ],



        // ---------------------------------------------
        // AREA IDS
        // ---------------------------------------------

        areaIds: [

          [],

          Validators.required

        ],



        // ---------------------------------------------
        // ADDRESS
        // ---------------------------------------------

        address: [

          '',

          Validators.required

        ],



        // ---------------------------------------------
        // CITY
        // ---------------------------------------------

        city: [

          '',

          Validators.required

        ],



        // ---------------------------------------------
        // STATE
        // ---------------------------------------------

        state: [

          '',

          Validators.required

        ]

      });

  }



  // =====================================================
  // NG ON INIT
  // =====================================================

  ngOnInit(): void {


    // -----------------------------------------------
    // DECODE LOGIN USER
    // -----------------------------------------------

    this.decodeToken();



    // -----------------------------------------------
    // CURRENT DATE
    // -----------------------------------------------

    const now = new Date();


    this.today =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')}`;



    // -----------------------------------------------
    // LOAD ACTIVE AREAS
    // -----------------------------------------------

    this.loadAreas();

  }



  // =====================================================
  // DECODE JWT
  // =====================================================

  decodeToken(): void {

    const token =
      localStorage.getItem('token');


    if (!token) {

      console.warn(
        'JWT token not found.'
      );

      return;

    }


    try {

      const decoded: any =
        jwtDecode(token);


      this.userId =
        Number(

          decoded?.userId ??

          decoded?.UserId ??

          decoded?.user_id ??

          decoded?.id ??

          0

        );


      console.log(
        'Current User ID:',
        this.userId
      );

    }

    catch (error) {

      console.error(
        'Failed to decode JWT:',
        error
      );


      this.userId = 0;

    }

  }



  // =====================================================
  // FORM CONTROLS
  // =====================================================

  get f() {

    return this.areaManagerForm.controls;

  }



  // =====================================================
  // FILTERED AREAS
  // =====================================================

  get filteredAreas(): Area[] {

    const search =
      this.areaSearch
        .trim()
        .toLowerCase();


    // No search
    if (!search) {

      return this.areas;

    }


    // Search by name or code
    return this.areas.filter(
      area =>

        area.areaName
          ?.toLowerCase()
          .includes(search)

        ||

        area.areaCode
          ?.toLowerCase()
          .includes(search)

    );

  }



  // =====================================================
  // LOAD AREAS
  // =====================================================

 // -----------------------------------------------
// LOAD ACTIVE AREAS
// -----------------------------------------------
loadAreas(): void {

  const agencyId =
    Number(localStorage.getItem('aid')) || 0;

  if (agencyId <= 0) {
    console.error('Invalid Agency ID');
    return;
  }

  this.isLoadingAreas = true;

  this.areaManagerService
    .get_all_area({
      agencyId: agencyId,
      isActive: true
    })
    .subscribe({

      // -------------------------------------------
      // SUCCESS
      // -------------------------------------------
      next: (res: any) => {

        console.log(
          'Area API Response:',
          res
        );

        this.areas =
          Array.isArray(res?.data)
            ? res.data
            : [];

        this.isLoadingAreas = false;

      },

      // -------------------------------------------
      // ERROR
      // -------------------------------------------
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
          text: 'Failed to load areas'
        });

      }

    });
}


  // =====================================================
  // TOGGLE DROPDOWN
  // =====================================================

  toggleAreaDropdown(): void {

    this.areaDropdownOpen =
      !this.areaDropdownOpen;

  }



  // =====================================================
  // CHECK AREA SELECTED
  // =====================================================

  isAreaSelected(
    areaId: number
  ): boolean {

    const selectedIds: number[] =
      (
        this.areaManagerForm
          .get('areaIds')
          ?.value || []
      )
        .map(
          (id: any) => Number(id)
        );


    return selectedIds.includes(
      areaId
    );

  }



  // =====================================================
  // TOGGLE AREA
  // =====================================================

  toggleArea(
    areaId: number
  ): void {

    const control =
      this.areaManagerForm
        .get('areaIds');


    if (!control) {

      return;

    }


    let selectedIds: number[] =
      (
        control.value || []
      )
        .map(
          (id: any) => Number(id)
        );


    // -----------------------------------------------
    // REMOVE
    // -----------------------------------------------

    if (
      selectedIds.includes(areaId)
    ) {

      selectedIds =
        selectedIds.filter(
          id => id !== areaId
        );

    }

    // -----------------------------------------------
    // ADD
    // -----------------------------------------------

    else {

      selectedIds.push(
        areaId
      );

    }


    // -----------------------------------------------
    // UPDATE FORM
    // -----------------------------------------------

    control.setValue(
      selectedIds
    );


    // -----------------------------------------------
    // UPDATE CHIPS
    // -----------------------------------------------

    this.updateSelectedAreas();

  }



  // =====================================================
  // UPDATE SELECTED AREAS
  // =====================================================

  updateSelectedAreas(): void {

    const selectedIds: number[] =
      (
        this.areaManagerForm
          .get('areaIds')
          ?.value || []
      )
        .map(
          (id: any) => Number(id)
        );


    this.selectedAreas =
      this.areas.filter(
        area =>
          selectedIds.includes(
            area.areaId
          )
      );

  }



  // =====================================================
  // REMOVE AREA
  // =====================================================

  removeArea(
    areaId: number,
    event: Event
  ): void {

    event.stopPropagation();


    const control =
      this.areaManagerForm
        .get('areaIds');


    if (!control) {

      return;

    }


    const selectedIds: number[] =
      (
        control.value || []
      )
        .map(
          (id: any) => Number(id)
        )
        .filter(
          (id: number) =>
            id !== areaId
        );


    control.setValue(
      selectedIds
    );


    this.updateSelectedAreas();

  }



  // =====================================================
  // SELECT ALL
  // =====================================================

  selectAllAreas(): void {

    const ids: number[] =
      this.filteredAreas
        .map(
          area => area.areaId
        );


    const currentIds: number[] =
      (
        this.areaManagerForm
          .get('areaIds')
          ?.value || []
      )
        .map(
          (id: any) => Number(id)
        );


    const mergedIds =
      Array.from(
        new Set([
          ...currentIds,
          ...ids
        ])
      );


    this.areaManagerForm
      .get('areaIds')
      ?.setValue(
        mergedIds
      );


    this.updateSelectedAreas();

  }



  // =====================================================
  // CLEAR ALL
  // =====================================================

  clearAllAreas(): void {

    this.areaManagerForm
      .get('areaIds')
      ?.setValue([]);


    this.updateSelectedAreas();

  }



  // =====================================================
  // SAVE AREA MANAGER
  // =====================================================

  saveAreaManager(): void {


    // -----------------------------------------------
    // SUBMITTED
    // -----------------------------------------------

    this.submitted = true;



    // -----------------------------------------------
    // FORM VALIDATION
    // -----------------------------------------------

    if (
      this.areaManagerForm.invalid
    ) {

      this.areaManagerForm
        .markAllAsTouched();

      return;

    }



    // -----------------------------------------------
    // AGENCY VALIDATION
    // -----------------------------------------------

    if (
      !this.agencyId ||
      this.agencyId <= 0
    ) {

      Swal.fire({

        icon: 'error',

        title: 'Error',

        text:
          'Invalid Agency ID.'

      });

      return;

    }



    // -----------------------------------------------
    // USER VALIDATION
    // -----------------------------------------------

    if (
      !this.userId ||
      this.userId <= 0
    ) {

      Swal.fire({

        icon: 'error',

        title: 'Error',

        text:
          'Logged-in user information not found.'

      });

      return;

    }



    // -----------------------------------------------
    // START LOADING
    // -----------------------------------------------

    this.isSaving = true;



    const formValue =
      this.areaManagerForm.value;



    // =================================================
    // SELECTED AREA IDS
    // =================================================

    const selectedAreaIds: number[] =
      Array.isArray(
        formValue.areaIds
      )
        ? formValue.areaIds
            .map(
              (id: any) =>
                Number(id)
            )
            .filter(
              (id: number) =>
                id > 0
            )
        : [];



    // =================================================
    // VALIDATE AREAS
    // =================================================

    if (
      selectedAreaIds.length === 0
    ) {

      this.isSaving = false;


      Swal.fire({

        icon: 'warning',

        title: 'Area Required',

        text:
          'Please select at least one area.'

      });


      return;

    }



    // =================================================
    // GET SELECTED AREA OBJECTS
    // =================================================

    const selectedAreas =
      this.areas.filter(
        area =>
          selectedAreaIds.includes(
            area.areaId
          )
      );



    // =================================================
    // ASSIGNED AREA STRING
    // =================================================

    const assignedArea =
      selectedAreas
        .map(
          area =>
            area.areaName
        )
        .join(', ');



    // =================================================
    // PAYLOAD
    // =================================================

    const payload = {

      agencyId:
        this.agencyId,


      name:
        formValue.name?.trim(),


      email:
        formValue.email?.trim(),


      mobile:
        formValue.mobile?.trim(),


      gender:
        formValue.gender,


      dateOfBirth:
        formValue.dateOfBirth
          ? formValue.dateOfBirth +
            'T00:00:00'
          : null,


      joiningDate:
        formValue.joiningDate
          ? formValue.joiningDate +
            'T00:00:00'
          : null,


      region:
        formValue.region?.trim(),


      // Existing database column
      assignedArea:
        assignedArea,


      // Mapping table
      areaIds:
        selectedAreaIds,


      address:
        formValue.address?.trim(),


      city:
        formValue.city?.trim(),


      state:
        formValue.state?.trim(),


      createdBy:
        this.userId

    };



    // =================================================
    // DEBUG
    // =================================================

    console.log(
      'Create Area Manager Payload:',
      payload
    );



    // =================================================
    // API CALL
    // =================================================

    this.areaManagerService
      .add_area_manager(payload)
      .subscribe({

        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        next: (res: any) => {

          this.isSaving = false;


          console.log(
            'Create Area Manager Response:',
            res
          );


          Swal.fire({

            icon: 'success',

            title: 'Success',

            text:
              res?.message ||
              'Area Manager Added Successfully',

            confirmButtonText:
              'OK'

          })
          .then(() => {


            // -----------------------------------------
            // RESET FORM
            // -----------------------------------------

            this.areaManagerForm.reset({

              name: '',

              email: '',

              gender: '',

              dateOfBirth: '',

              joiningDate: '',

              mobile: '',

              region: '',

              areaIds: [],

              address: '',

              city: '',

              state: ''

            });


            // -----------------------------------------
            // RESET AREA UI
            // -----------------------------------------

            this.selectedAreas = [];

            this.areaSearch = '';

            this.areaDropdownOpen = false;

            this.submitted = false;



            // -----------------------------------------
            // NAVIGATION
            // -----------------------------------------

            this.router.navigate([

              '/area-manager/area-manager-dashboard'

            ]);

          });

        },



        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        error: (err: any) => {

          this.isSaving = false;


          console.error(
            'Create Area Manager Error:',
            err
          );


          Swal.fire({

            icon: 'error',

            title: 'Error',

            text:
              err?.error?.message ||
              err?.error?.title ||
              'Failed To Add Area Manager'

          });

        }

      });

  }



  // =====================================================
  // FUTURE DATE VALIDATOR
  // =====================================================

  futureDateValidator(
    control: any
  ) {

    if (!control.value) {

      return null;

    }


    const selectedDate =
      new Date(
        control.value
      );


    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );


    selectedDate.setHours(
      0,
      0,
      0,
      0
    );


    if (
      selectedDate > today
    ) {

      return {
        futureDate: true
      };

    }


    return null;

  }

}