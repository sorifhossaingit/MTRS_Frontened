import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminMasterService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getdashboradsummery() {
    return this.http.get(`${this.apiUrl}/super-admin/dashboard/summary`);
  }

  getAgency(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin-agency/get-agency-admin`,
      { params }
    );
  }

  updateAgency(data: any) {
    return this.http.put(`${this.apiUrl}/admin-agency/update-agency-user`, data);
  }

  addAgency(data: any) {
    return this.http.post(`${this.apiUrl}/admin-agency/create`, data);
  }

}
