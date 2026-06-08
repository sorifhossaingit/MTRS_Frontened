import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class LayoutService {
 private apiUrl = environment.authurl;


  constructor(private http: HttpClient) { }

  change_password(data: any) {
    return this.http.post(`${this.apiUrl}/Auth/change-password`, data);
  }

  logged_out(data: any) {
    return this.http.post(`${this.apiUrl}/Auth/logout`, data);
  }

}
 