import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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


  get_area_manager_list(params: any) {
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

get_all_area(params: {
  agencyId: number;
  mrId?: number;
  areaName?: string;
  areaCode?: string;
  isActive?: boolean;
}) {

  let httpParams = new HttpParams()
    .set(
      'agencyId',
      params.agencyId.toString()
    );

  // ============================================
  // CHECK ROLE
  // ============================================

  const rid =
    localStorage.getItem('rid');

  const MR_ROLE_ID =
    'fd1c87b5-524a-49e5-b60c-5d7b82ddeb43';

  // ============================================
  // SEND MR ID ONLY FOR MR ROLE
  // ============================================

  if (rid === MR_ROLE_ID) {

    const mrId =
      Number(
        localStorage.getItem('mid')
      );

    if (mrId > 0) {

      httpParams =
        httpParams.set(
          'mrId',
          mrId.toString()
        );
    }
  }

  // ============================================
  // AREA NAME
  // ============================================

  if (
    params.areaName !== undefined &&
    params.areaName !== null &&
    params.areaName.trim() !== ''
  ) {

    httpParams =
      httpParams.set(
        'areaName',
        params.areaName.trim()
      );
  }

  // ============================================
  // AREA CODE
  // ============================================

  if (
    params.areaCode !== undefined &&
    params.areaCode !== null &&
    params.areaCode.trim() !== ''
  ) {

    httpParams =
      httpParams.set(
        'areaCode',
        params.areaCode.trim()
      );
  }

  // ============================================
  // ACTIVE FILTER
  // ============================================

  if (
    params.isActive !== undefined &&
    params.isActive !== null
  ) {

    httpParams =
      httpParams.set(
        'isActive',
        params.isActive.toString()
      );
  }

  console.log(
    'Get All Area Params:',
    httpParams.toString()
  );

  return this.http.get(
    `${this.apiUrl}/admin/area-manager/get-all-area`,
    {
      params: httpParams
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

  getActiveAreaManagers(agencyId: number) {
  return this.http.get(
    `${this.apiUrl}/admin/area-manager/dropdown/active-area-managers/${agencyId}`
  );
}

getAreaForAreaManager(
  agencyId: number,
  areaManagerId: number
) {
  return this.http.get(
    `${this.apiUrl}/areamanager/get-area-for-area-manager`,
    {
      params: {
        agencyId: agencyId.toString(),
        areaManagerId: areaManagerId.toString()
      }
    }
  );
}

}