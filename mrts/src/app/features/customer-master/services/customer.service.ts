import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
  
  

}
