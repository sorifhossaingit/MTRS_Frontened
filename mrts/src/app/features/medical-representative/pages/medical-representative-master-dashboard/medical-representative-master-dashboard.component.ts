import { Component, OnInit } from '@angular/core';
import {
  UserCheck,
  Plus,
  ClipboardList,
  CheckCircle,
  MapPin,
  Route,
  Package,
  ShoppingCart,
  MapPinned,
  Calendar
} from 'lucide-angular';
import { MrService } from '../../services/mr.service';

interface DcrItem {
  doctor: string;
  time: string;
  status: string;
}

interface RouteItem {
  location: string;
  time: string;
}

interface SampleItem {
  product: string;
  qty: number;
}

@Component({
  selector: 'app-medical-representative-master-dashboard',
  templateUrl: './medical-representative-master-dashboard.component.html',
  styleUrl: './medical-representative-master-dashboard.component.css'
})
export class MedicalRepresentativeMasterDashboardComponent implements OnInit {

  // Icons
  UserCheck = UserCheck;
  Plus = Plus;
  ClipboardList = ClipboardList;
  CheckCircle = CheckCircle;
  MapPin = MapPin;
  Route = Route;
  Package = Package;
  MapPinned = MapPinned;
  ShoppingCart = ShoppingCart;
  Calendar = Calendar;

  // ID and Loading state
  mrmainidId: number | null = null;
  isLoading = false;

  // Current Month String
  currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // Primary Metrics
  attendanceStatus = 'Present';
  visitsDone = 0;
  routeCount = 0;
  samplesGiven = 0;
  totalOrders = 0;

  // Monthly Metrics
  monthlyVisitsDone = 0;
  monthlyOrders = 0;
  monthlyTargetPercentage = 0;

  // Visit Breakdown
  completedVisits = 0;
  inProgressVisits = 0;
  rejectedVisits = 0;

  // Route Breakdown
  plannedRouteVisits = 0;
  withoutRouteVisits = 0;

  // Product & Order Breakdown
  totalShownProducts = 0;
  pendingOrders = 0;
  deliveredOrders = 0;
  rejectedOrders = 0;

  // List Data
  dcrList: DcrItem[] = [];
  routePlan: RouteItem[] = [];
  samples: SampleItem[] = [];
  lastLocationTime = 'N/A';

  constructor(private mrService: MrService) {}

  ngOnInit(): void {
    this.mrmainidId = Number(localStorage.getItem('mid')) || null;
    if (this.mrmainidId) {
      this.getMrDashboard();
    }
  }

  getMrDashboard(): void {
    if (!this.mrmainidId) return;

    this.isLoading = true;

    this.mrService.getMrDashboard(this.mrmainidId).subscribe({
      next: (response: any) => {
        if (response?.success && response?.data) {
          const data = response.data;

          // Main Stats
          this.visitsDone = data.completedVisits ?? 0;
          this.completedVisits = data.completedVisits ?? 0;
          this.inProgressVisits = data.inProgressVisits ?? 0;
          this.rejectedVisits = data.rejectedVisits ?? 0;

          // Route & Product Stats
          this.routeCount = data.plannedRouteVisits ?? 0;
          this.plannedRouteVisits = data.plannedRouteVisits ?? 0;
          this.withoutRouteVisits = data.withoutRouteVisits ?? 0;
          this.samplesGiven = data.totalShownProducts ?? 0;
          this.totalShownProducts = data.totalShownProducts ?? 0;

          // Monthly Stats
          this.monthlyVisitsDone = data.monthlyVisitsDone ?? data.completedVisits ?? 0;
          this.monthlyOrders = data.monthlyOrders ?? data.totalOrders ?? 0;
          this.monthlyTargetPercentage = data.monthlyTargetPercentage ?? 0;

          // Orders Stats
          this.totalOrders = data.totalOrders ?? 0;
          this.pendingOrders = data.pendingOrders ?? 0;
          this.deliveredOrders = data.deliveredOrders ?? 0;
          this.rejectedOrders = data.rejectedOrders ?? 0;

          // Lists
          this.dcrList = data.dcrList ?? [];
          this.routePlan = data.routePlan ?? [];
          this.samples = data.samples ?? [];
          this.lastLocationTime = data.lastLocationTime ?? 'Just now';
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('MR Dashboard API Error:', error);
        this.isLoading = false;
      }
    });
  }
}