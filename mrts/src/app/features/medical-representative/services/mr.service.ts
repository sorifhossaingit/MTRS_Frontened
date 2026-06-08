import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';



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


}
