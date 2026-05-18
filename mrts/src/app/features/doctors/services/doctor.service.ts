import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }




  getdoctordashboradsummery(agenid: any) {
    return this.http.get(`${this.apiUrl}/Doctor/dashboard/summary/${agenid}`);
  }


  getdoctordetails(params: any) {
    return this.http.get(
      `${this.apiUrl}/Doctor/dashboard/getdoctorbyagency`, { params });
  }


  adddoctor(data: any) {
    return this.http.put(`${this.apiUrl}/Doctor/dashboard/createdoctor`, data);
  }


  updatedoctordetails(data: any) {
    return this.http.put(`${this.apiUrl}/Doctor/dashboard/updatedoctor`, data);
  }






}
