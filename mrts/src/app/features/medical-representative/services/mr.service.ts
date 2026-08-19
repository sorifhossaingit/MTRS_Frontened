import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MrService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }



  get_mr(data: any) {
    return this.http.post(`${this.apiUrl}/areamanager/get-medical-representatives`, data);
  }

  add_mr(data: any) {
    return this.http.post(`${this.apiUrl}/areamanager/create-Medicalrepresentative`, data);
  }

  update_mr(data: any) {
    return this.http.put(`${this.apiUrl}/areamanager/update-medicalrepresentative`, data);
  }



  //MR OWN APIs 

  get_inventory_for_order(params: any) {
    return this.http.get(
      `${this.apiUrl}/medicalpresentativeown/nearest-stockist-inventory`, { params });
  }

  mr_create_order(data: any) {
    return this.http.post(`${this.apiUrl}/medicalpresentativeown/create-order`, data);
  }


  //MR ORDER TO STOCKIST APIs

  get_mr_order_list(data: any) {
    return this.http.post(`${this.apiUrl}/mrorder/mr-ordr-list`, data);
  }

  get_mr_order_preview(orderid: any) {
    return this.http.get(
      `${this.apiUrl}/mrorder/mr-order-details/${orderid}`);
  }

  update_order_status_by_mr(data: any) {
    return this.http.put(`${this.apiUrl}/areamanager/updatestatus-mr_deliver-order`, data);
  }


  //MR VISIT DASHBOARD APIs

  get_visit_plan(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/visit-plans`, data);
  }

  get_assigned_area_manager(params: any) {
    return this.http.get(
      `${this.apiUrl}/medicalpresentativeown/assigned-area-manager`, { params });
  }

  visit_accepted_by_mr(data: any) {
    return this.http.put(`${this.apiUrl}/mrvisit/mr/accept-visit-by-mr`, data);
  }

  start_visit(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/start`, data);
  }

  track_visit(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/track`, data);
  }

  end_visit(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/end`, data);
  }

  get_today_started_visit(agencyId: number, mrId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/mrvisit/today-started?agencyId=${agencyId}&mrId=${mrId}`);
  }
  get_tracking_of_mr(visitplanid: any) {
    return this.http.get(
      `${this.apiUrl}/mrvisit/tracking-of-mr/${visitplanid}`);
  }

  complete_visit(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/complete-customer-visit-by-mr`, data);
  }

  get_customers(params: any) {
    return this.http.get(
      `${this.apiUrl}/mrvisit/ar-dropown-customers`, { params });
  }

  get_active_session(visitPlanId: number) {
    return this.http.get(
      `${this.apiUrl}/mrvisit/get-active-session/${visitPlanId}`
    );
  }

  //Mr attendance APIs

  get_mr_attendance_summary(mrid: any) {
    return this.http.get(
      `${this.apiUrl}/medicalpresentativeown/attendence-dashboard/attendance-summary/${mrid}`);
  }

  get_mr_attendance_data(mrid: any) {
    return this.http.get(
      `${this.apiUrl}/medicalpresentativeown/attendence-dashboard/attendance-calendar/${mrid}`);
  }

  getMedicalRepresentativeId(userId: number) {
    return this.http.get<any>(
      `${this.apiUrl}/medicalpresentativeown/medicalrepresentative-get-id/${userId}`
    );
  }


  // ------------representative add-----------


  getRouteList(agencyId: any) {
    return this.http.get(
      `${this.apiUrl}/admin/customer/get-route?agencyId=${agencyId}`
    );
  }

  // mr.service.ts
  getStockiestList(agencyId: number, assignedAreaManagerId: number) {
    return this.http.get(
      `${this.apiUrl}/areamanager/stockist-list-for-mrcreate`,
      {
        params: {
          agencyId: agencyId,
          assignedAreaManagerId: assignedAreaManagerId
        }
      }
    );
  }

  // ------------------mr order----
  get_routes_by_mr(mrId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/mrvisit/get-routes-by-medicalrepresentative/${mrId}`);
  }



get_customers_by_route_mr(
  routeId: number,
  agencyId: number,
  areaManagerId: number
): Observable<any> {

  return this.http.get(
    `${this.apiUrl}/mrvisit/get-customers-by-route`,
    {
      params: {
        routeId: routeId.toString(),
        agencyId: agencyId.toString(),
        areaManagerId: areaManagerId.toString()
      }
    }
  );
}

  // --------------------- MR DASHBOARD ---------------------

  getMrDashboard(mrId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/medicalpresentativeown/get-mr-dashboard/${mrId}`
    );
  }

  getTodayVisitsDashboard(mrId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/medicalpresentativeown/today-visits-dashboard/${mrId}`
    );
  }

  getTodayVisitProductsDashboard(mrId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/medicalpresentativeown/today-visit-products-dashboard/${mrId}`
    );
  }

  // ---------------------
  get_attendance_dashboard_ar(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/attendence/mr-attendance-dashboard`, data);
  }

  getAreaManagerForUpdateCustomer(
  agencyId: number,
  medicalRepresentativeId: number
): Observable<any> {

  return this.http.get(
    `${this.apiUrl}/admin/area-manager/get-area-manager-for-update-customer`,
    {
      params: {
        agencyId: agencyId.toString(),
        medicalRepresentativeId:
          medicalRepresentativeId.toString()
      }
    }
  );
}

}
