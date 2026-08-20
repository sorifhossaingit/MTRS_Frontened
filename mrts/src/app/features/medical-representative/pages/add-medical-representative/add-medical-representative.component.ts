import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
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
import { CustomerService } from '../../../customer-master/services/customer.service';

interface RouteItem {
  routeId: number;
  routeName: string;
  description?: string;
}

interface StockistItem {
  stockistId: number;
  name: string;
  city: string;
  firmType: string;
}

@Component({
  selector: 'app-add-medical-representative',
  templateUrl: './add-medical-representative.component.html',
  styleUrl: './add-medical-representative.component.css'
})
export class AddMedicalRepresentativeComponent implements OnInit {

  // Lucide Icons
  readonly UserPlus = UserPlus;
  readonly ArrowLeft = ArrowLeft;
  readonly User = User;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly MapPin = MapPin;
  readonly Briefcase = Briefcase;
  readonly Calendar = Calendar;
  readonly UserCheck = UserCheck;
  readonly Map = Map;
  readonly Route = Route;
  readonly Users = Users;
  readonly Building2 = Building2;
  readonly BarChart3 = BarChart3;
  readonly Target = Target;
  readonly TrendingUp = TrendingUp;
  readonly Hash = Hash;
  readonly Percent = Percent;
  readonly CheckCircle = CheckCircle;
  readonly Save = Save;

  // Form & Local Variables
  mrForm!: FormGroup;
  submitted = false;
  isSaving = false;
  routeList: RouteItem[] = [];
  stockietList: StockistItem[] = [];

  // Multi-Select Route Dropdown State
  showRouteDropdown = false;
  routeSearch = '';
  filteredRoutes: RouteItem[] = [];
  selectedRoutes: RouteItem[] = [];

  readonly agencyId = Number(localStorage.getItem('aid')) || 0;
  readonly managerId = Number(localStorage.getItem('mid')) || 0;
  readonly createdBy = Number(localStorage.getItem('uid')) || 0;

  // Route Modal Management
  showRouteModal = false;
  newRouteName = '';
  newRouteDescription = '';

  constructor(
    private fb: FormBuilder,
    private mrService: MrService,
    private customerService: CustomerService,
    private router: Router,
    private eRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getRouteList();
    this.getStockiestList();
  }

  get f() {
    return this.mrForm.controls;
  }

  initializeForm(): void {
    this.mrForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      region: ['', Validators.required],
      routeIds: [[], Validators.required],
      stockistId: [null, Validators.required]
    });
  }

  getRouteList(): void {
    this.mrService.getRouteList(this.agencyId).subscribe({
      next: (res: any) => {
        this.routeList = res?.data || [];
        this.filteredRoutes = [...this.routeList];
        this.syncSelectedRoutesFromForm();
      },
      error: (err: any) => {
        console.error('Failed to fetch Route List:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to load routes.'
        });
      }
    });
  }

  getStockiestList(): void {
    this.mrService.getStockiestList(this.agencyId, this.managerId).subscribe({
      next: (res: any) => {
        this.stockietList = res || [];
      },
      error: (err: any) => {
        console.error('Failed to fetch Stockist List:', err);
      }
    });
  }

  // --- Multi-Select Route Dropdown Logic ---

  filterRoutes(): void {
    const search = this.routeSearch.trim().toLowerCase();
    if (!search) {
      this.filteredRoutes = [...this.routeList];
      return;
    }
    this.filteredRoutes = this.routeList.filter((item: RouteItem) =>
      item.routeName?.toLowerCase().includes(search)
    );
  }

  isSelected(routeId: number): boolean {
    const currentIds: number[] = this.mrForm.get('routeIds')?.value || [];
    return currentIds.map(id => Number(id)).includes(Number(routeId));
  }

  toggleRoute(item: RouteItem): void {
    const routeControl = this.mrForm.get('routeIds');
    if (!routeControl) return;

    const currentIds: number[] = [...(routeControl.value || [])].map(id => Number(id));
    const routeId = Number(item.routeId);

    if (currentIds.includes(routeId)) {
      const updatedIds = currentIds.filter(id => id !== routeId);
      routeControl.setValue(updatedIds);
      this.selectedRoutes = this.selectedRoutes.filter(route => Number(route.routeId) !== routeId);
    } else {
      currentIds.push(routeId);
      routeControl.setValue(currentIds);
      if (!this.selectedRoutes.some(route => Number(route.routeId) === routeId)) {
        this.selectedRoutes.push(item);
      }
    }

    routeControl.markAsTouched();
    routeControl.markAsDirty();
  }

  removeRoute(routeId: number): void {
    const routeControl = this.mrForm.get('routeIds');
    if (!routeControl) return;

    const currentIds: number[] = [...(routeControl.value || [])].map(id => Number(id));
    const updatedIds = currentIds.filter(id => id !== Number(routeId));

    routeControl.setValue(updatedIds);
    this.selectedRoutes = this.selectedRoutes.filter(route => Number(route.routeId) !== Number(routeId));

    routeControl.markAsTouched();
    routeControl.markAsDirty();
  }

  private syncSelectedRoutesFromForm(): void {
    const currentIds: number[] = (this.mrForm.get('routeIds')?.value || []).map((id: any) => Number(id));
    this.selectedRoutes = this.routeList.filter(route => currentIds.includes(Number(route.routeId)));
  }

  // Close dropdown on outside click
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdownContainer = this.eRef.nativeElement.querySelector('.route-dropdown-container');
    if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
      this.showRouteDropdown = false;
    }
  }

  // --- Add Route Modal Operations ---

  openRouteModal(): void {
    this.newRouteName = '';
    this.newRouteDescription = '';
    this.showRouteModal = true;
  }

  closeRouteModal(): void {
    this.showRouteModal = false;
    this.newRouteName = '';
    this.newRouteDescription = '';
  }

  addRoute(): void {
    const routeName = this.newRouteName?.trim();
    if (!routeName) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'Route Name is required.'
      });
      return;
    }

    const payload = {
      agencyId: Number(this.agencyId),
      routeName: routeName,
      description: this.newRouteDescription?.trim() || '',
      createdby: Number(this.createdBy)
    };

    this.customerService.createRoute(payload).subscribe({
      next: (res: any) => {
        const newRouteId = Number(res?.data?.routeId);
        this.closeRouteModal();
        this.getRouteListAndSelect(newRouteId);

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res?.message || 'Route Added Successfully.'
        });
      },
      error: (err: any) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Unable to add route.'
        });
      }
    });
  }

  getRouteListAndSelect(newRouteId?: number): void {
    this.mrService.getRouteList(this.agencyId).subscribe({
      next: (res: any) => {
        this.routeList = res?.data || [];
        this.filteredRoutes = [...this.routeList];

        const routeControl = this.mrForm.get('routeIds');
        let currentIds: number[] = [...(routeControl?.value || [])].map(id => Number(id));

        if (newRouteId) {
          const newRoute = this.routeList.find(route => Number(route.routeId) === Number(newRouteId));
          if (newRoute && !currentIds.includes(Number(newRoute.routeId))) {
            currentIds.push(Number(newRoute.routeId));
          }
        }

        routeControl?.setValue(currentIds);
        this.selectedRoutes = this.routeList.filter(route => currentIds.includes(Number(route.routeId)));
      },
      error: (err: any) => {
        console.error('Failed to fetch Route List:', err);
      }
    });
  }

  // --- Save & Reset Operations ---

  saveMr(): void {
    this.submitted = true;

    if (this.mrForm.invalid || this.isSaving) {
      this.mrForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.'
      });
      return;
    }

    this.isSaving = true;
    const rawRouteIds = this.mrForm.value.routeIds || [];
    const formattedRouteIds = rawRouteIds.map((id: any) => Number(id));

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
      stockistId: Number(this.mrForm.value.stockistId),
      routeIds: formattedRouteIds,
      createdBy: this.managerId
    };

    this.mrService.add_mr(payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Medical Representative added successfully'
          });
          this.resetForm();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res?.message || 'Failed to add Medical Representative'
          });
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'Something went wrong'
        });
      }
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.mrForm.reset();
    this.selectedRoutes = [];
    this.routeSearch = '';
    this.showRouteDropdown = false;
    this.filterRoutes();
  }
}