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
    return this.http.get(`${this.apiUrl}/SuperAdmin/dashboard/summary`);
  }

  getAgency(params: any) {
    return this.http.get(
      `${this.apiUrl}/SuperAdmin/dashboard/agencylist`,
      { params }
    );
  }

  updateAgency(data: any) {
    return this.http.put(`${this.apiUrl}/SuperAdmin/dashboard/agencyupdate`, data);
  }

}
