import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StockistService {
  
private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getstockistdashboarddetails(params: any) {
    return this.http.get(
      `${this.apiUrl}/Customer/dashboard/customer-dashboard`, { params });
  }

  getstockistdetails(params: any) {
    return this.http.get(
      `${this.apiUrl}/Stockiest/get-stockiestlist`, { params });
  }


  addstockist(data: any) {
    return this.http.post(`${this.apiUrl}/Stockiest/create-stockiest`, data);
  }


  updatestockistdetails(data: any) {
    return this.http.put(`${this.apiUrl}/Stockiest/update-stockeist`, data);
  }

 

}
