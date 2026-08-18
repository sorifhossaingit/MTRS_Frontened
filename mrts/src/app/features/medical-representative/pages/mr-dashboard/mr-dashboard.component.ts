import { Component, OnInit, HostListener, ElementRef, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Pencil,
  Trash2,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-angular';
import { MrService } from '../../services/mr.service';

@Component({
  selector: 'app-mr-dashboard',
  templateUrl: './mr-dashboard.component.html',
  styleUrl: './mr-dashboard.component.css'
})
export class MrDashboardComponent implements OnInit {

  @ViewChild('routeDropdownContainer') routeDropdownContainer!: ElementRef;

  // Lucide Icons
  Users = Users;
  UserCheck = UserCheck;
  UserX = UserX;
  Search = Search;
  Pencil = Pencil;
  Trash2 = Trash2;
  Plus = Plus;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  // Data Arrays
  mrList: any[] = [];
  routeList: any[] = [];
  filteredRoutes: any[] = [];
  stockistList: any[] = [];

  // Multi-Select Searchable Dropdown State
  selectedRouteIds: number[] = [];
  showRouteDropdown = false;
  routeSearch = '';
  private routeSearch$ = new Subject<string>();

  // Reactive Forms
  filterForm!: FormGroup;
  updateForm!: FormGroup;

  // Pagination
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;

  // Modal Control
  showUpdateModal = false;
  isUpdating = false;

  // Local Storage Data
  agencyId = Number(localStorage.getItem('aid'));
  managerId = Number(localStorage.getItem('mid'));

    // KPI
  totalMR = 0;
  activeMR = 0;
  presentCount = 0;
  absentCount = 0;
  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private mrService: MrService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.setupDebounceFilter();
    this.getMrList();
    this.getRouteList();
    this.getStockistList();
    this.loadDashboard();
  }

  // Close route dropdown when clicking anywhere outside the dropdown container
  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (this.routeDropdownContainer && !this.routeDropdownContainer.nativeElement.contains(event.target)) {
      this.showRouteDropdown = false;
    }
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
      name: ['', Validators.required],
      contactPerson: [''],
      mobile: [''],
      email: [''],
      address: [''],
      city: [''],
      state: [''],
      pincode: [''],
      region: [''],
      stockistId: [0],
      routeIds: [[]],
      isActive: [true]
    });
  }

  setupDebounceFilter(): void {
    this.routeSearch$
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe((search) => {
        if (!search) {
          this.filteredRoutes = [...this.routeList];
        } else {
          this.filteredRoutes = this.routeList.filter(r =>
            r.routeName?.toLowerCase().includes(search)
          );
        }
      });
  }

  onRouteSearchChange(): void {
    this.routeSearch$.next(this.routeSearch.toLowerCase().trim());
  }



    loadDashboard(): void {

    const payload = {
      agencyId: this.agencyId,
      areaManagerId: this.managerId
    };

    this.mrService
      .get_attendance_dashboard_ar(payload)
      .subscribe({
        next: (res: any) => {

          if (res.success) {

            this.totalMR =
              res.data.totalMedicalRepresentatives || 0;

            this.activeMR =
              res.data.activeMedicalRepresentatives || 0;

            this.presentCount =
              res.data.presentMedicalRepresentatives || 0;

            this.absentCount =
              res.data.absentMedicalRepresentatives || 0;
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
  

  getRouteList(): void {
    this.mrService.getRouteList(this.agencyId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.routeList = res.data || [];
          this.filteredRoutes = [...this.routeList];
        },
        error: (err: any) => {
          console.error('Failed to fetch Route List:', err);
        }
      });
  }

getStockistList(): void {

  this.mrService
    .getStockiestList(this.agencyId, this.managerId)
    .subscribe({
      next: (res: any) => {
        this.stockistList = res || [];
        console.log('Stockist List:', this.stockistList);
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

    this.mrService.get_mr(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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

  // --- Multi-Select Searchable Dropdown Logic ---

  toggleRouteDropdown(event?: Event): void {
    if (event) event.stopPropagation();
    this.showRouteDropdown = !this.showRouteDropdown;
  }

  isSelected(routeId: number): boolean {
    return this.selectedRouteIds.includes(routeId);
  }

  toggleRoute(item: any): void {
    const index = this.selectedRouteIds.indexOf(item.routeId);
    if (index > -1) {
      this.selectedRouteIds.splice(index, 1);
    } else {
      this.selectedRouteIds.push(item.routeId);
    }
    this.updateForm.patchValue({ routeIds: [...this.selectedRouteIds] });
    this.updateForm.markAsDirty();
  }

  get selectedRouteLabels(): string {
    if (this.selectedRouteIds.length === 0) {
      return 'Select Route(s)';
    }
    const selectedNames = this.routeList
      .filter(r => this.selectedRouteIds.includes(r.routeId))
      .map(r => r.routeName);
    return selectedNames.join(', ');
  }

  // --- Form & Action Handlers ---

  applyFilter(): void {
    this.pageNumber = 1;
    this.getMrList();
  }

  resetFilter(): void {
    this.filterForm.reset({
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
    // Populate routeIds array or fallback to routeNames mapping
    if (Array.isArray(mr.routeIds) && mr.routeIds.length > 0) {
      this.selectedRouteIds = [...mr.routeIds];
    } else if (mr.routeNames && this.routeList.length > 0) {
      const names = mr.routeNames.split(',').map((n: string) => n.trim().toLowerCase());
      this.selectedRouteIds = this.routeList
        .filter(r => names.includes(r.routeName?.trim().toLowerCase()))
        .map(r => r.routeId);
    } else {
      this.selectedRouteIds = mr.routeId ? [mr.routeId] : [];
    }

    // Reset dropdown search state
    this.routeSearch = '';
    this.filteredRoutes = [...this.routeList];
    this.showRouteDropdown = false;

    // Patch Form Values
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
      stockistId: mr.stockistId || 0,
      routeIds: [...this.selectedRouteIds],
      isActive: mr.isActive
    });

    this.showUpdateModal = true;
  }

  closeModal(): void {
    this.showUpdateModal = false;
    this.showRouteDropdown = false;
  }
updateMr(): void {
  if (this.updateForm.invalid || this.isUpdating) {
    this.updateForm.markAllAsTouched();
    return;
  }

  this.isUpdating = true;

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
    stockistId: Number(formValue.stockistId) || 0,
    routeIds: formValue.routeIds || [],
    isActive: formValue.isActive,
    updatedBy: this.managerId
  };

  this.mrService.update_mr(payload)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res: any) => {

        this.isUpdating = false;

        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'MR updated successfully'
          });

          this.showUpdateModal = false;
          this.getMrList();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res?.message || 'Failed to update MR'
          });
        }
      },

      error: (err: any) => {

        this.isUpdating = false;

        console.error(err);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Failed to update MR'
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

      let currentRouteIds: number[] = [];
      if (Array.isArray(mr.routeIds)) {
        currentRouteIds = mr.routeIds;
      } else if (mr.routeId) {
        currentRouteIds = [mr.routeId];
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
        stockistId: Number(mr.stockistId) || 0,
        routeIds: currentRouteIds,
        isActive: false,
        updatedBy: this.managerId
      };

      this.mrService.update_mr(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
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