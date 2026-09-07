import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Search,
  Plus,
  Edit,
  X,
  Save,
  MapPin,
  RefreshCw,
  CheckCircle,
  XCircle,
  Building2
} from 'lucide-angular';

// import { AreaManagerService } from '../services/area-manager.service';
import { AreaManagerService } from '../../services/area-manager.service';

@Component({
  selector: 'app-area-management',
  templateUrl: './area-management.component.html',
  styleUrl: './area-management.component.css'
})
export class AreaManagementComponent implements OnInit {

  // =========================================================
  // LUCIDE ICONS
  // =========================================================

  Search = Search;
  Plus = Plus;
  Edit = Edit;
  X = X;
  Save = Save;
  MapPin = MapPin;
  RefreshCw = RefreshCw;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  Building2 = Building2;
 Math = Math;

  // =========================================================
  // FORM
  // =========================================================

  areaForm!: FormGroup;

  submitted = false;


  // =========================================================
  // DATA
  // =========================================================

  areas: any[] = [];

  selectedArea: any = null;


  // =========================================================
  // AGENCY
  // =========================================================

  agencyId = 0;


  // =========================================================
  // FILTER
  // =========================================================

  searchAreaName = '';

  searchAreaCode = '';


  // =========================================================
  // STATE
  // =========================================================

  isLoading = false;

  isSaving = false;

  showModal = false;

  isEditMode = false;


  // =========================================================
  // PAGINATION
  // =========================================================

  currentPage = 1;

  pageSize = 10;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private fb: FormBuilder,
    private areaManagerService: AreaManagerService
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.getAgencyId();

    this.initializeForm();

    this.getAreas();

  }


  // =========================================================
  // GET AGENCY ID FROM LOCAL STORAGE
  // =========================================================

  private getAgencyId(): void {

    const aid = localStorage.getItem('aid');

    this.agencyId = Number(aid);

    console.log(
      'Agency ID:',
      this.agencyId
    );

  }


  // =========================================================
  // INITIALIZE FORM
  // =========================================================

  initializeForm(): void {

    this.areaForm = this.fb.group({

      areaId: [0],

      areaName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150)
        ]
      ],

      areaCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],

      description: [
        '',
        [
          Validators.maxLength(500)
        ]
      ],

      isActive: [true]

    });

  }


  // =========================================================
  // FORM GETTER
  // =========================================================

  get f() {

    return this.areaForm.controls;

  }


  // =========================================================
  // GET ALL AREAS
  // =========================================================

  getAreas(): void {

    this.getAgencyId();


    if (this.agencyId <= 0) {

      console.error(
        'Agency ID not found in localStorage.'
      );

      this.areas = [];

      return;

    }


    this.isLoading = true;


    const params: any = {

      agencyId: this.agencyId

    };


    // Area name filter

    if (this.searchAreaName.trim()) {

      params.areaName =
        this.searchAreaName.trim();

    }


    // Area code filter

    if (this.searchAreaCode.trim()) {

      params.areaCode =
        this.searchAreaCode.trim();

    }


    console.log(
      'GET AREA PARAMS:',
      params
    );


    this.areaManagerService
      .get_all_area(params)
      .subscribe({

        next: (response: any) => {

          this.isLoading = false;


          console.log(
            'GET AREA RESPONSE:',
            response
          );


          if (
            response &&
            response.success === true
          ) {

            this.areas =
              Array.isArray(response.data)
                ? response.data
                : [];

          }
          else {

            this.areas = [];

          }


          this.currentPage = 1;

        },

        error: (error: any) => {

          this.isLoading = false;

          this.areas = [];

          console.error(
            'GET AREA ERROR:',
            error
          );

        }

      });

  }


  // =========================================================
  // SEARCH
  // =========================================================

  search(): void {

    this.currentPage = 1;

    this.getAreas();

  }


  // =========================================================
  // RESET FILTER
  // =========================================================

  resetFilters(): void {

    this.searchAreaName = '';

    this.searchAreaCode = '';

    this.currentPage = 1;

    this.getAreas();

  }


  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  openAddModal(): void {

    this.isEditMode = false;

    this.selectedArea = null;

    this.submitted = false;


    this.areaForm.reset({

      areaId: 0,

      areaName: '',

      areaCode: '',

      description: '',

      isActive: true

    });


    this.showModal = true;

  }


  // =========================================================
  // EDIT AREA
  // =========================================================

  editArea(area: any): void {

    console.log(
      'EDIT AREA:',
      area
    );


    this.isEditMode = true;

    this.selectedArea = area;

    this.submitted = false;


    // IMPORTANT:
    // Your API response is camelCase.
    // Use the row directly instead of calling
    // get-by-id again.

    this.areaForm.patchValue({

      areaId:
        Number(area.areaId),

      areaName:
        area.areaName || '',

      areaCode:
        area.areaCode || '',

      description:
        area.description || '',

      isActive:
        area.isActive === true

    });


    console.log(
      'EDIT FORM:',
      this.areaForm.value
    );


    this.showModal = true;

  }


  // =========================================================
  // CLOSE MODAL
  // =========================================================

  closeModal(): void {

    if (this.isSaving) {

      return;

    }


    this.showModal = false;

    this.submitted = false;

    this.selectedArea = null;

    this.areaForm.reset({

      areaId: 0,

      areaName: '',

      areaCode: '',

      description: '',

      isActive: true

    });

  }


  // =========================================================
  // SAVE AREA
  // CREATE / UPDATE
  // =========================================================

  saveArea(): void {

    this.submitted = true;


    // Validate

    if (this.areaForm.invalid) {

      this.areaForm.markAllAsTouched();

      return;

    }


    // Get agency ID

    this.getAgencyId();


    if (this.agencyId <= 0) {

      console.error(
        'Agency ID not found.'
      );

      return;

    }


    this.isSaving = true;


    const formValue =
      this.areaForm.getRawValue();


    // =======================================================
    // PAYLOAD
    // =======================================================

    const payload = {

      agencyId:
        this.agencyId,

      areaName:
        String(
          formValue.areaName || ''
        ).trim(),

      areaCode:
        String(
          formValue.areaCode || ''
        ).trim(),

      description:
        formValue.description
          ? String(
              formValue.description
            ).trim()
          : null,

      isActive:
        formValue.isActive === true

    };


    console.log(
      'AREA PAYLOAD:',
      payload
    );


    // =======================================================
    // UPDATE
    // =======================================================

    if (this.isEditMode) {

      const areaId =
        Number(formValue.areaId);


      if (areaId <= 0) {

        this.isSaving = false;

        console.error(
          'Invalid area ID.'
        );

        return;

      }


      console.log(
        'UPDATE AREA:',
        areaId,
        payload
      );


      this.areaManagerService
        .update_area(
          areaId,
          payload
        )
        .subscribe({

          next: (response: any) => {

            this.isSaving = false;


            console.log(
              'UPDATE RESPONSE:',
              response
            );


            if (
              response &&
              response.success === true
            ) {

              this.closeModal();

              this.getAreas();

            }

          },

          error: (error: any) => {

            this.isSaving = false;


            console.error(
              'UPDATE AREA ERROR:',
              error
            );

          }

        });


      return;

    }


    // =======================================================
    // CREATE
    // =======================================================

    console.log(
      'CREATE AREA:',
      payload
    );


    this.areaManagerService
      .create_area(payload)
      .subscribe({

        next: (response: any) => {

          this.isSaving = false;


          console.log(
            'CREATE RESPONSE:',
            response
          );


          if (
            response &&
            response.success === true
          ) {

            this.closeModal();

            this.getAreas();

          }

        },

        error: (error: any) => {

          this.isSaving = false;


          console.error(
            'CREATE AREA ERROR:',
            error
          );

        }

      });

  }


  // =========================================================
  // PAGINATION
  // =========================================================

  get paginatedAreas(): any[] {

    const start =
      (this.currentPage - 1) *
      this.pageSize;


    return this.areas.slice(
      start,
      start + this.pageSize
    );

  }


  // =========================================================
  // TOTAL PAGES
  // =========================================================

  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(
        this.areas.length /
        this.pageSize
      )
    );

  }


  // =========================================================
  // NEXT PAGE
  // =========================================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

    }

  }


  // =========================================================
  // PREVIOUS PAGE
  // =========================================================

  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

    }

  }


  // =========================================================
  // TRACK BY
  // =========================================================

  trackByAreaId(
    index: number,
    area: any
  ): number {

    return Number(
      area.areaId || index
    );

  }

}