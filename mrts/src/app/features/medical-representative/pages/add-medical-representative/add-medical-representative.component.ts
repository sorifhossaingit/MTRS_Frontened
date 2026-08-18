import { Component, OnInit, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-add-medical-representative',
  templateUrl: './add-medical-representative.component.html',
  styleUrl: './add-medical-representative.component.css'
})
export class AddMedicalRepresentativeComponent implements OnInit {

  // Lucide Icons
  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  User = User;
  Phone = Phone;
  Mail = Mail;
  MapPin = MapPin;
  Briefcase = Briefcase;
  Calendar = Calendar;
  UserCheck = UserCheck;
  Map = Map;
  Route = Route;
  Users = Users;
  Building2 = Building2;
  BarChart3 = BarChart3;
  Target = Target;
  TrendingUp = TrendingUp;
  Hash = Hash;
  Percent = Percent;
  CheckCircle = CheckCircle;
  Save = Save;

  // Form & Local Variables
  mrForm!: FormGroup;
  submitted = false;
  isSaving = false;
  routeList: any[] = [];
  stockietList: any[] = [];

  // Multi-Select Route Dropdown State
  showRouteDropdown = false;
  routeSearch = '';
  filteredRoutes: any[] = [];
  selectedRoutes: any[] = [];

  agencyId = Number(localStorage.getItem('aid'));
  managerId = Number(localStorage.getItem('mid'));

  constructor(
    private fb: FormBuilder,
    private mrService: MrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getRouteList();
    this.getStockiestList();
  }

  getRouteList(): void {
    this.mrService
      .getRouteList(this.agencyId)
      .subscribe({
        next: (res: any) => {
          this.routeList = res.data || [];
          this.filteredRoutes = [...this.routeList];
          this.syncSelectedRoutesFromForm();
        },
        error: (err: any) => {
          console.error('Failed to fetch Route List:', err);
        }
      });
  }

getStockiestList(): void {

  this.mrService
    .getStockiestList(this.agencyId, this.managerId)
    .subscribe({
      next: (res: any) => {
        this.stockietList = res || [];
        console.log('Stockist List:', this.stockietList);
      },
      error: (err: any) => {
        console.error('Failed to fetch Stockist List:', err);
      }
    });
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

  get f() {
    return this.mrForm.controls;
  }

  // --- Searchable Multi-Select Route Logic ---

  filterRoutes(): void {
    const search = this.routeSearch.trim().toLowerCase();
    if (!search) {
      this.filteredRoutes = [...this.routeList];
    } else {
      this.filteredRoutes = this.routeList.filter((item) =>
        item.routeName.toLowerCase().includes(search)
      );
    }
  }

  isSelected(routeId: number): boolean {
    const currentIds: number[] = this.mrForm.get('routeIds')?.value || [];
    return currentIds.includes(routeId);
  }

  toggleRoute(item: any): void {
    const currentIds: number[] = [...(this.mrForm.get('routeIds')?.value || [])];
    const index = currentIds.indexOf(item.routeId);

    if (index > -1) {
      currentIds.splice(index, 1);
      this.selectedRoutes = this.selectedRoutes.filter((r) => r.routeId !== item.routeId);
    } else {
      currentIds.push(item.routeId);
      this.selectedRoutes.push(item);
    }

    this.mrForm.get('routeIds')?.setValue(currentIds.length ? currentIds : null);
    this.mrForm.get('routeIds')?.markAsTouched();
  }

  removeRoute(routeId: number): void {
    const currentIds: number[] = [...(this.mrForm.get('routeIds')?.value || [])];
    const updatedIds = currentIds.filter((id) => id !== routeId);

    this.selectedRoutes = this.selectedRoutes.filter((r) => r.routeId !== routeId);
    this.mrForm.get('routeIds')?.setValue(updatedIds.length ? updatedIds : null);
    this.mrForm.get('routeIds')?.markAsTouched();
  }

  private syncSelectedRoutesFromForm(): void {
    const currentIds: number[] = this.mrForm.get('routeIds')?.value || [];
    this.selectedRoutes = this.routeList.filter((r) => currentIds.includes(r.routeId));
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (targetElement && !targetElement.closest('.relative')) {
      this.showRouteDropdown = false;
    }
  }

  // --- Save & Reset Operations ---

saveMr(): void {
  this.submitted = true;

  if (this.mrForm.invalid || this.isSaving) {
    this.mrForm.markAllAsTouched();

    if (this.mrForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.'
      });
    }

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