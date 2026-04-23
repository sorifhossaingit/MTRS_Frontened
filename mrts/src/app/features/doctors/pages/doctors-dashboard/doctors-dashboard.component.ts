import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Activity, Calendar, Eye, Pencil, Stethoscope, Trash2, Users } from 'lucide-angular';

@Component({
  selector: 'app-doctors-dashboard',
  templateUrl: './doctors-dashboard.component.html',
  styleUrl: './doctors-dashboard.component.css'
})
export class DoctorsDashboardComponent {

  // // 🔷 Lucide Icons
  Stethoscope = Stethoscope;
  Users = Users;
  Activity = Activity;
  Calendar = Calendar;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;

  constructor(private router: Router) {}

  // 🔷 Dashboard Stats
  totalDoctors = 120;
  activeDoctors = 95;
  categoryA = 40;
  todayVisits = 18;

  // 🔷 Filters
  searchText: string = '';
  filterCategory: string = '';

  // 🔷 Doctor Data
  doctors: any[] = [
    {
      id: 1,
      name: 'Dr. Rahul Sharma',
      qualification: 'MBBS, MD',
      specialization: 'Cardiologist',
      clinic: 'City Hospital',
      category: 'A',
      lastVisit: '2026-04-20',
      nextVisit: '2026-04-25',
      isActive: true
    },
    {
      id: 2,
      name: 'Dr. Priya Singh',
      qualification: 'MBBS',
      specialization: 'Dermatologist',
      clinic: 'Health Clinic',
      category: 'B',
      lastVisit: '2026-04-18',
      nextVisit: '2026-04-26',
      isActive: false
    }
  ];

  // 🔷 Navigation Functions
  viewDoctor(id: number) {
    this.router.navigate(['/doctors/profile', id]);
  }

  editDoctor(id: number) {
    this.router.navigate(['/doctors/add'], {
      queryParams: { id }
    });
  }

  deleteDoctor(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this doctor?');

    if (confirmDelete) {
      this.doctors = this.doctors.filter(d => d.id !== id);
    }
  }

  // 🔷 Optional: Filter Logic (Advanced)
  get filteredDoctors() {
    return this.doctors.filter(doc => {
      const matchesSearch =
        doc.name.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesCategory =
        this.filterCategory ? doc.category === this.filterCategory : true;

      return matchesSearch && matchesCategory;
    });
  }
}