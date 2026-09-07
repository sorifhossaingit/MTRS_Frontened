import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AreaManagerService {
  private apiUrl = environment.apiUrl;
  private authurl = environment.authurl;

  constructor(private http: HttpClient) { }

   get_area_manager_dashborad_summery(agencyid: any) {
    return this.http.get(`${this.apiUrl}/admin/area-manager/area-manager-dashboard/${agencyid}`);
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


  reset_password(data: any) {
    return this.http.post(`${this.authurl}/Auth/reset-password`, data);
  }



  // =========================================================
  // AREA MANAGEMENT
  // =========================================================

  create_area(data: any) {

    return this.http.post(
      `${this.apiUrl}/admin/area-manager/create-area`,
      data
    );

  }

  get_all_area(params: any) {

    return this.http.get(
      `${this.apiUrl}/admin/area-manager/get-all-area`,
      {
        params: params
      }
    );

  }

  get_area_by_id(areaId: number) {

    return this.http.get(
      `${this.apiUrl}/admin/area-manager/get_area-id/${areaId}`
    );

  }

  update_area(
    areaId: number,
    data: any
  ) {

    return this.http.put(
      `${this.apiUrl}/admin/area-manager/update-area/${areaId}`,
      data
    );

  }

}