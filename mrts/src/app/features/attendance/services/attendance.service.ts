import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

 private apiUrl = environment.apiUrl;
   
     constructor(private http: HttpClient) { }



  get_attendance_dashboard(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/attendence/mr-attendance-dashboard`, data);
  }

  get_attendance_list(data: any) {
    return this.http.post(`${this.apiUrl}/mrvisit/attendence/mr-attendance-list`, data);
  }

}
