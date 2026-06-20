import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

export interface AdminDashboard {
  totalCurrentMonthVisits: number;
  activeMedicalRepresentatives: number;
  inactiveMedicalRepresentatives: number;
  activeStockists: number;
  inactiveStockists: number;
  activeAreaManagers: number;
  inactiveAreaManagers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard(agencyId: number): Observable<ApiResponse<AdminDashboard>> {
    return this.http.get<ApiResponse<AdminDashboard>>(
      `${this.apiUrl}/admin-agency/admin-dashboard/${agencyId}`
    );
  }

getVisitStatusDashboard(payload: any): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/admin-agency/admin-dashboard/visit-status-dashboard`,
    payload
  );
}

getCompletedVisits(agencyId: number): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/admin-agency/admin-dashboard/completed-visits/${agencyId}`
  );
}

getTopMedicalRepresentatives(agencyId: number): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/admin-agency/admin-dashboard/top-medical-representatives/${agencyId}`
  );
}
}