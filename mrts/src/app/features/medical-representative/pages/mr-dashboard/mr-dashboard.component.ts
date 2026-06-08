import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Pencil,
  Trash2,
  Plus
} from 'lucide-angular';
import { MrService } from '../../services/mr.service';

@Component({
  selector: 'app-mr-dashboard',
  templateUrl: './mr-dashboard.component.html',
  styleUrl: './mr-dashboard.component.css'
})
export class MrDashboardComponent implements OnInit {

  // Lucide Icons
  Users = Users;
  UserCheck = UserCheck;
  UserX = UserX;
  Search = Search;
  Pencil = Pencil;
  Trash2 = Trash2;
  Plus = Plus;

  // Data
  mrList: any[] = [];

  // Forms
  filterForm!: FormGroup;
  updateForm!: FormGroup;

  // Pagination
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;

  // Modal
  showUpdateModal = false;

  // Local Storage
  agencyId = Number(localStorage.getItem('aid'));
  managerId = Number(localStorage.getItem('mid'));

  constructor(
    private fb: FormBuilder,
    private mrService: MrService
  ) { }

  ngOnInit(): void {

    this.initializeForms();
    this.getMrList();

  }

  initializeForms(): void {

    this.filterForm = this.fb.group({
      name: [''],
      email: [''],
      mobile: [''],
      isActive: [null]
    });

    this.updateForm = this.fb.group({
      medicalRepresentativeId: [0],
      name: [''],
      contactPerson: [''],
      mobile: [''],
      email: [''],
      address: [''],
      city: [''],
      state: [''],
      pincode: [''],
      region: [''],
      coverArea: [''],
      stockistId: [0],
      isActive: [true]
    });

  }

  // ==========================
  // GET MR LIST
  // ==========================
  getMrList(): void {

    const payload = {
      agencyId: this.agencyId,
      assignedAreaManager: this.managerId,
      name: this.filterForm?.value?.name || null,
      email: this.filterForm?.value?.email || null,
      mobile: this.filterForm?.value?.mobile || null,
      isActive:
        this.filterForm?.value?.isActive === null
          ? null
          : this.filterForm?.value?.isActive,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.mrService.get_mr(payload).subscribe({
      next: (res: any) => {

        if (res?.success) {

          this.mrList = res.data || [];
          this.totalRecords = res.totalRecords || 0;

        }

      },
      error: (err: any) => {

        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load MR list'
        });

      }
    });

  }

  // ==========================
  // FILTER
  // ==========================
  applyFilter(): void {

    this.pageNumber = 1;
    this.getMrList();

  }

  resetFilter(): void {

    this.filterForm.patchValue({
      name: '',
      email: '',
      mobile: '',
      isActive: null
    });

    this.pageNumber = 1;

    this.getMrList();

  }

  // ==========================
  // PAGINATION
  // ==========================
  changePage(page: number): void {

    const totalPages = this.totalPages;

    if (page < 1 || page > totalPages) {
      return;
    }

    this.pageNumber = page;
    this.getMrList();

  }

  get totalPages(): number {

    return Math.ceil(this.totalRecords / this.pageSize);

  }

  // ==========================
  // OPEN UPDATE MODAL
  // ==========================
  editMr(mr: any): void {

    this.updateForm.patchValue({
      medicalRepresentativeId: mr.medicalRepresentativeId,
      name: mr.name,
      contactPerson: mr.contactPerson,
      mobile: mr.mobile,
      email: mr.email,
      address: mr.address,
      city: mr.city,
      state: mr.state,
      pincode: mr.pincode,
      region: mr.region,
      coverArea: mr.coverArea,
      stockistId: mr.stockistId || 0,
      isActive: mr.isActive
    });

    this.showUpdateModal = true;

  }

  closeModal(): void {

    this.showUpdateModal = false;

  }

  // ==========================
  // UPDATE MR
  // ==========================
  updateMr(): void {

    const formValue = this.updateForm.value;

    const payload = {
      medicalRepresentativeId: formValue.medicalRepresentativeId,
      name: formValue.name,
      contactPerson: formValue.contactPerson,
      mobile: formValue.mobile,
      email: formValue.email,
      address: formValue.address,
      city: formValue.city,
      state: formValue.state,
      pincode: formValue.pincode,
      region: formValue.region,
      assignedAreaManager: this.managerId,
      coverArea: formValue.coverArea,
      stockistId: formValue.stockistId || null,
      isActive: formValue.isActive,
      updatedBy: this.managerId
    };

    this.mrService.update_mr(payload).subscribe({
      next: (res: any) => {

        if (res?.success) {

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'MR updated successfully'
          });

          this.showUpdateModal = false;

          this.getMrList();

        }

      },
      error: (err: any) => {

        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update MR'
        });

      }
    });

  }

  // ==========================
  // SOFT DELETE MR
  // ==========================
  deleteMr(mr: any): void {

    Swal.fire({
      title: 'Delete MR?',
      text: 'This MR will be marked as inactive.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }

      const payload = {
        medicalRepresentativeId: mr.medicalRepresentativeId,
        name: mr.name,
        contactPerson: mr.contactPerson,
        mobile: mr.mobile,
        email: mr.email,
        address: mr.address,
        city: mr.city,
        state: mr.state,
        pincode: mr.pincode,
        region: mr.region,
        assignedAreaManager: this.managerId,
        coverArea: mr.coverArea,
        stockistId: mr.stockistId || 0,

        // Soft Delete
        isActive: false,

        updatedBy: this.managerId
      };

      this.mrService.update_mr(payload).subscribe({
        next: (res: any) => {

          if (res?.success) {

            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'MR marked as inactive successfully.'
            });

            this.getMrList();

          }

        },
        error: (err: any) => {

          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete MR.'
          });

        }
      });

    });

  }

  get activeCount(): number {
    return this.mrList.filter(x => x.isActive).length;
  }

  get inactiveCount(): number {
    return this.mrList.filter(x => !x.isActive).length;
  }

}
