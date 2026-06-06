import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AreaManagerService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

   get_area_manager_dashborad_summery(agenid: any) {
    return this.http.get(`${this.apiUrl}/Doctor/dashboard/summary/${agenid}`);
  }


  get_area_manager_details(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin/area-manager/area-manager-list`, { params });
  }


  add_area_manager(data: any) {
    return this.http.post(`${this.apiUrl}/admin/area-manager/create`, data);
  }


  update_area_manager_details(data: any) {
    return this.http.put(`${this.apiUrl}/admin/area-manager/update`, data);
  }



}
