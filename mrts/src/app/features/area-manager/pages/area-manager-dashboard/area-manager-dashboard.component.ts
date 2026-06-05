import { Component } from '@angular/core';
import {
  Briefcase,
  UserPlus,
  Users,
  Activity,
  UserCheck,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-angular';

@Component({
  selector: 'app-area-manager-dashboard',
  templateUrl: './area-manager-dashboard.component.html',
  styleUrl: './area-manager-dashboard.component.css'
})
export class AreaManagerDashboardComponent {

  // Icons
  Briefcase = Briefcase;
  UserPlus = UserPlus;
  Users = Users;
  Activity = Activity;
  UserCheck = UserCheck;
  Calendar = Calendar;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;

  // Dashboard Cards
  totalManagers = 12;
  activeManagers = 10;
  totalMRs = 75;
  todayVisits = 145;

  // Filters
  searchText = '';
  selectedRegion = '';

  // Pagination
  currentPage = 1;
  totalPages = 5;
  totalRecords = 50;
  pages: number[] = [1, 2, 3, 4, 5];

  // Table Data
  areaManagers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      employeeCode: 'AM001',
      mobile: '9876543210',
      email: 'rajesh@gmail.com',
      region: 'East',
      totalMRs: 8,
      totalDoctors: 120,
      totalHospitals: 15,
      isActive: true
    },
    {
      id: 2,
      name: 'Amit Sharma',
      employeeCode: 'AM002',
      mobile: '9876543211',
      email: 'amit@gmail.com',
      region: 'North',
      totalMRs: 6,
      totalDoctors: 95,
      totalHospitals: 12,
      isActive: true
    },
    {
      id: 3,
      name: 'Sourav Das',
      employeeCode: 'AM003',
      mobile: '9876543212',
      email: 'sourav@gmail.com',
      region: 'South',
      totalMRs: 10,
      totalDoctors: 150,
      totalHospitals: 20,
      isActive: false
    },
    {
      id: 4,
      name: 'Rakesh Singh',
      employeeCode: 'AM004',
      mobile: '9876543213',
      email: 'rakesh@gmail.com',
      region: 'West',
      totalMRs: 7,
      totalDoctors: 110,
      totalHospitals: 14,
      isActive: true
    }
  ];

  // Actions
  viewManager(id: number) {
    console.log('View Manager:', id);
  }

  editManager(manager: any) {
    console.log('Edit Manager:', manager);
  }

  deleteManager(manager: any) {
    if (confirm(`Delete ${manager.name}?`)) {
      this.areaManagers = this.areaManagers.filter(
        x => x.id !== manager.id
      );
    }
  }

  // Pagination
  goToPage(page: number) {
    this.currentPage = page;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
