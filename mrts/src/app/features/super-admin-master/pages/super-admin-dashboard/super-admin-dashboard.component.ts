import { Component , OnInit  } from '@angular/core';
import {
  ShieldCheck,
  UserPlus,
  Building2,
  BadgeCheck,
  AlertTriangle,
  Users,
  Eye,
  Pencil,
  Trash2
} from 'lucide-angular';


@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.css'
})
export class SuperAdminDashboardComponent implements OnInit {

  // Icons
   ShieldCheck = ShieldCheck;
   UserPlus = UserPlus;
   Building2 = Building2;
   BadgeCheck = BadgeCheck;
   AlertTriangle = AlertTriangle;
   Users = Users;
   Eye = Eye;
   Pencil = Pencil;
   Trash2 = Trash2;

  // Stats
  totalCompanies = 0;
  activeCompanies = 0;
  expiredPlans = 0;
  totalUsers = 0;

  // Search + Filter
  searchText = '';
  filterStatus = '';

  // Companies
  companies = [
    {
      id: 1,
      companyName: 'Sun Pharma',
      adminName: 'Rahul Sharma',
      email: 'sunpharma@test.com',
      location: 'Mumbai',
      plan: 'Premium',
      totalEmployees: 120,
      expiryDate: '12 Dec 2026',
      status: 'active'
    },
    {
      id: 2,
      companyName: 'Cipla',
      adminName: 'Amit Verma',
      email: 'cipla@test.com',
      location: 'Delhi',
      plan: 'Standard',
      totalEmployees: 80,
      expiryDate: '25 Aug 2026',
      status: 'active'
    },
    {
      id: 3,
      companyName: 'Mankind Pharma',
      adminName: 'Sourav Das',
      email: 'mankind@test.com',
      location: 'Kolkata',
      plan: 'Basic',
      totalEmployees: 40,
      expiryDate: '10 Jan 2025',
      status: 'expired'
    }
  ];

  filteredCompanies: any[] = [];

  ngOnInit(): void {
    this.filteredCompanies = this.companies;
    this.calculateStats();
  }

  calculateStats() {
    this.totalCompanies = this.companies.length;

    this.activeCompanies = this.companies.filter(
      x => x.status === 'active'
    ).length;

    this.expiredPlans = this.companies.filter(
      x => x.status === 'expired'
    ).length;

    this.totalUsers = this.companies.reduce(
      (sum, item) => sum + item.totalEmployees,
      0
    );
  }

  applyFilter() {

    this.filteredCompanies = this.companies.filter(company => {

      const matchesSearch =
        company.companyName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        company.adminName.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.filterStatus === '' ||
        company.status === this.filterStatus;

      return matchesSearch && matchesStatus;
    });

  }

  viewCompany(id: number) {
    console.log('View Company', id);
  }

  editCompany(id: number) {
    console.log('Edit Company', id);
  }

  deleteCompany(id: number) {

    const confirmDelete = confirm('Are you sure you want to delete?');

    if (confirmDelete) {

      this.companies = this.companies.filter(
        company => company.id !== id
      );

      this.applyFilter();
      this.calculateStats();
    }

  }

}