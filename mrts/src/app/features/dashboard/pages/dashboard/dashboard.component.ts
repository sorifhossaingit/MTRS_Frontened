import { Component, OnInit } from '@angular/core';
import { AdminDashboard, AdminDashboardService } from './service/admin-dashboard-service.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  currentDate = new Date();
  visitStatus: any;

  selectedDate: string = new Date().toISOString().split('T')[0];

  dashboard: AdminDashboard = {
    totalCurrentMonthVisits: 0,
    activeMedicalRepresentatives: 0,
    inactiveMedicalRepresentatives: 0,
    activeStockists: 0,
    inactiveStockists: 0,
    activeAreaManagers: 0,
    inactiveAreaManagers: 0
  };


completedVisits: any[] = [];
topPerformers: any[] = [];

constructor(private dashboardService: AdminDashboardService) { }


  
agencyId: number = Number(localStorage.getItem('aid'));


ngOnInit(): void {
  this.loadDashboard();
  this.loadVisitStatusDashboard();
  this.loadCompletedVisits();
  this.loadTopPerformers();
}

  loadDashboard(): void {
    const agencyId = this.agencyId;

    this.dashboardService.getDashboard(agencyId).subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboard = response.data;
        }
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
      }
    });
  }


  barChartType: ChartType = 'bar';

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Assigned', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Visits'
      }
    ]
  };

  // Doughnut Chart
  doughnutChartType: ChartType = 'doughnut';

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Assigned', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [0, 0, 0]
      }
    ]
  };

  loadVisitStatusDashboard() {

    const payload = {
      agencyId: this.agencyId,
      selectedDate: this.selectedDate
    };

    this.dashboardService.getVisitStatusDashboard(payload)
      .subscribe({
        next: (res) => {

          this.visitStatus = res.data;

          this.barChartData = {
            labels: ['Assigned', 'In Progress', 'Completed'],
            datasets: [
              {
                data: [
                  this.visitStatus.totalAssignedVisits,
                  this.visitStatus.totalInProgressVisits,
                  this.visitStatus.totalCompletedVisits
                ],
                label: 'Visits'
              }
            ]
          };

          this.doughnutChartData = {
            labels: ['Assigned', 'In Progress', 'Completed'],
            datasets: [
              {
                data: [
                  this.visitStatus.totalAssignedVisits,
                  this.visitStatus.totalInProgressVisits,
                  this.visitStatus.totalCompletedVisits
                ]
              }
            ]
          };
        }
      });
  }

  loadCompletedVisits(): void {
  this.dashboardService
    .getCompletedVisits(this.agencyId)
    .subscribe({
      next: (res) => {
        this.completedVisits = res.data || [];
      },
      error: (err) => {
        console.error(err);
      }
    });
}

loadTopPerformers(): void {
  this.dashboardService
    .getTopMedicalRepresentatives(this.agencyId)
    .subscribe({
      next: (res) => {
        this.topPerformers = res.data || [];
      },
      error: (err) => {
        console.error(err);
      }
    });
}
}
