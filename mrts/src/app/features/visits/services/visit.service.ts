import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private apiUrl = environment.apiUrl;
  
    constructor(private http: HttpClient) { }

//AREA MANAGER VISIT MANAGEMENT API
  assign_visit(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/assign-visit`, data);
  }

  getproductdetails(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin/product/list`, { params });
  }

  get_mrs(params: any) {
    return this.http.get(
      `${this.apiUrl}/mrvisit/ar-dropdown-medicalrepresentatives`, { params });
  }


  get_customers(params: any) {
    return this.http.get(
      `${this.apiUrl}/mrvisit/ar-dropown-customers`, { params });
  }



//VISIT DASHBOARD APIs

  get_visit_plan(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/visit-plans`, data);
  }

  update_visit(data: any) {
    return this.http.put(`${this.apiUrl}/mrvisit/update-visit`, data);
  }


  cancel_visit(data: any) {
    return this.http.put(`${this.apiUrl}/mrvisit/cancel-visit`, data);
  }


  get_tracking_of_mr(visitplanid: any) {
    return this.http.get(
      `${this.apiUrl}/mrvisit/tracking-of-mr/${visitplanid}`);
  }

  // ---------------------------------visit---
  getRoutesByMedicalRepresentative(mrId: number) {
  return this.http.get(
    `${this.apiUrl}/mrvisit/get-routes-by-medicalrepresentative/${mrId}`
  );
}

get_customers_by_route_visit(
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
