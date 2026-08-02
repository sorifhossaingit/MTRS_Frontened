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

  // Data Arrays
  mrList: any[] = [];
  routeList: any[] = [];
  stockietList: any[] = [];

  // Reactive Forms
  filterForm!: FormGroup;
  updateForm!: FormGroup;

  // Pagination
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;

  // Modal Control
  showUpdateModal = false;

  // Local Storage Data
  agencyId = Number(localStorage.getItem('aid'));
  managerId = Number(localStorage.getItem('mid'));

  constructor(
    private fb: FormBuilder,
    private mrService: MrService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.getMrList();
    this.getRouteList();
    this.getStockiestList();
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
      routeId: [0],
      stockistId: [0],
      isActive: [true]
    });
  }

  getRouteList(): void {
    this.mrService.getRouteList(this.agencyId).subscribe({
      next: (res: any) => {
        this.routeList = res.data || [];
      },
      error: (err: any) => {
        console.error('Failed to fetch Route List:', err);
      }
    });
  }

  getStockiestList(): void {
    this.mrService.getStockiestList(this.agencyId).subscribe({
      next: (res: any) => {
        this.stockietList = res.data || [];
      },
      error: (err: any) => {
        console.error('Failed to fetch Stockist List:', err);
      }
    });
  }

  getMrList(): void {
    const payload = {
      agencyId: this.agencyId,
      assignedAreaManager: this.managerId,
      name: this.filterForm?.value?.name || null,
      email: this.filterForm?.value?.email || null,
      mobile: this.filterForm?.value?.mobile || null,
      isActive: this.filterForm?.value?.isActive ?? null,
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

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.getMrList();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize) || 1;
  }

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
      routeId: mr.routeId || 0,
      stockistId: mr.stockistId || 0,
      isActive: mr.isActive
    });

    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showUpdateModal = false;
  }

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
      routeId: Number(formValue.routeId) || 0,
      stockistId: Number(formValue.stockistId) || 0,
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
      if (!result.isConfirmed) return;

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
        routeId: Number(mr.routeId) || 0,
        stockistId: Number(mr.stockistId) || 0,
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