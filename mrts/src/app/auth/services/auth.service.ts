import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  get_stockist_id(userid: any) {
    return this.http.get(`${this.apiUrl}/GetUserId/stockist-id/${userid}`);
  }

  get_area_manager_id(userid: any) {
    return this.http.get(`${this.apiUrl}/GetUserId/area-manager-id/${userid}`);
  }
  
  get_mr_id(userid: any) {
    return this.http.get(`${this.apiUrl}/getuserid/medical-representative-id/${userid}`);
  }
}
