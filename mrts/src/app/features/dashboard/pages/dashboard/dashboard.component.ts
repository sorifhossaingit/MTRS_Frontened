
import { Component, OnInit } from '@angular/core';

import {
  AdminDashboard,
  AdminDashboardService
} from './service/admin-dashboard-service.service';

import {
  MapPin,
  Users,
  Building2,
  BriefcaseBusiness,
  Calendar,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-angular';

import {
  ChartConfiguration,
  ChartType
} from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  // =====================================================
  // LUCIDE ICONS
  // =====================================================

  MapPin = MapPin;
  Users = Users;
  Building2 = Building2;
  BriefcaseBusiness = BriefcaseBusiness;
  Calendar = Calendar;
  ClipboardList = ClipboardList;
  Clock = Clock;
  CheckCircle = CheckCircle;
  XCircle = XCircle;


  // =====================================================
  // DATE
  // =====================================================

  currentDate = new Date();

  selectedDate: string = (() => {

    const today = new Date();

    return `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, '0')}-01`;

  })();


  // =====================================================
  // DASHBOARD
  // =====================================================

  visitStatus: any;

  dashboard: AdminDashboard = {

    totalCurrentMonthVisits: 0,

    activeMedicalRepresentatives: 0,

    inactiveMedicalRepresentatives: 0,

    activeStockists: 0,

    inactiveStockists: 0,

    activeAreaManagers: 0,

    inactiveAreaManagers: 0

  };


  // =====================================================
  // DATA
  // =====================================================

  completedVisits: any[] = [];

  topPerformers: any[] = [];


  // =====================================================
  // AGENCY
  // =====================================================

  agencyId: number =
    Number(localStorage.getItem('aid')) || 0;


  // =====================================================
  // CHART TYPES
  // =====================================================

  barChartType: ChartType = 'bar';

  doughnutChartType: ChartType = 'doughnut';


  // =====================================================
  // BAR CHART
  // =====================================================

  barChartData: ChartConfiguration<'bar'>['data'] = {

    labels: [
      'Assigned',
      'In Progress',
      'Completed',
      'Rejected'
    ],

    datasets: [
      {
        data: [0, 0, 0, 0],
        label: 'Visits'
      }
    ]

  };


  // =====================================================
  // DOUGHNUT CHART
  // =====================================================

  doughnutChartData:
    ChartConfiguration<'doughnut'>['data'] = {

    labels: [
      'Assigned',
      'In Progress',
      'Completed',
      'Rejected'
    ],

    datasets: [
      {
        data: [0, 0, 0, 0]
      }
    ]

  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private dashboardService: AdminDashboardService
  ) { }


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadDashboard();

    this.loadVisitStatusDashboard();

    this.loadCompletedVisits();

    this.loadTopPerformers();

  }


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  loadDashboard(): void {

    const agencyId = this.agencyId;

    this.dashboardService
      .getDashboard(agencyId)
      .subscribe({

        next: (response) => {

          if (response.success) {

            this.dashboard =
              response.data;

          }

        },

        error: (err) => {

          console.error(
            'Dashboard Error:',
            err
          );

        }

      });

  }


  // =====================================================
  // LOAD VISIT STATUS
  // =====================================================

  loadVisitStatusDashboard(): void {

    const payload = {

      agencyId: this.agencyId,

      selectedDate: this.selectedDate

    };


    this.dashboardService
      .getVisitStatusDashboard(payload)
      .subscribe({

        next: (res) => {

          this.visitStatus =
            res?.data || {};


          const chartValues = [

            this.visitStatus
              ?.totalAssignedVisits || 0,

            this.visitStatus
              ?.totalInProgressVisits || 0,

            this.visitStatus
              ?.totalCompletedVisits || 0,

            this.visitStatus
              ?.totalRejectedVisits || 0

          ];


          // BAR CHART

          this.barChartData = {

            labels: [
              'Assigned',
              'In Progress',
              'Completed',
              'Rejected'
            ],

            datasets: [

              {

                data: chartValues,

                label: 'Visits'

              }

            ]

          };


          // DOUGHNUT CHART

          this.doughnutChartData = {

            labels: [
              'Assigned',
              'In Progress',
              'Completed',
              'Rejected'
            ],

            datasets: [

              {

                data: chartValues

              }

            ]

          };

        },

        error: (err) => {

          console.error(
            'Visit Status Dashboard Error:',
            err
          );

        }

      });

  }


  // =====================================================
  // LOAD COMPLETED VISITS
  // =====================================================

  loadCompletedVisits(): void {

    this.dashboardService
      .getCompletedVisits(this.agencyId)
      .subscribe({

        next: (res) => {

          this.completedVisits =
            res?.data || [];

        },

        error: (err) => {

          console.error(
            'Completed Visits Error:',
            err
          );

        }

      });

  }


  // =====================================================
  // LOAD TOP PERFORMERS
  // =====================================================

  loadTopPerformers(): void {

    this.dashboardService
      .getTopMedicalRepresentatives(
        this.agencyId
      )
      .subscribe({

        next: (res) => {

          this.topPerformers =
            res?.data || [];

        },

        error: (err) => {

          console.error(
            'Top Performers Error:',
            err
          );

        }

      });

  }

}

