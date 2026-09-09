import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  


  getcustomerdashboarddetails(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin/customer/dashboard/customer-dashboard`, { params });
  }

  getcustomerdetails(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin/customer/dashboard/get-customers`, { params });
  }


  addcustomer(data: any) {
    return this.http.post(`${this.apiUrl}/admin/customer/create-customer`, data);
  }


  updatecustomerdetails(data: any) {
    return this.http.put(`${this.apiUrl}/admin/customer/update-customer`, data);
  }

  getAreamanagerlist(agencyId: any) {
    return this.http.get(
      `${this.apiUrl}/admin/area-manager/dropdown/active-area-managers/${agencyId}`);
  }
  

  // --------------------------------------------------
getCustomerTypeList(agencyId: number) {
  return this.http.get(
    `${this.apiUrl}/admin/customer/get-all-customertype?agencyId=${agencyId}`
  );
}
createCustomerType(payload: any) {
  return this.http.post(
    `${this.apiUrl}/admin/customer/create-customertype`,
    payload
  );
}

// -----------------------------------
getRouteList(
  agencyId: number,
  areaId?: number
) {
  const params: any = {
    agencyId: agencyId.toString()
  };

  if (
    areaId !== undefined &&
    areaId !== null &&
    Number(areaId) > 0
  ) {
    params.areaId = areaId.toString();
  }

  return this.http.get(
    `${this.apiUrl}/admin/customer/get-route`,
    {
      params
    }
  );
}

createRoute(payload: any): Observable<any> {
    return this.http.post( `${this.apiUrl}/admin/customer/create-route`, payload);
  }

updateCustomerStatus(payload: any) {
  return this.http.post(
   `${environment.apiUrl}/admin/customer/update-customer-status`,
    payload
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
