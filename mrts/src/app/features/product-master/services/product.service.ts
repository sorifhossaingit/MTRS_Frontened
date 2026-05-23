import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

   getproductdetails(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin/product/list`, { params });
  }

  addproduct(data: any) {
    return this.http.post(`${this.apiUrl}/admin/product/create`, data);
  }

   updateproductdetails(data: any) {
    return this.http.put(`${this.apiUrl}/admin/product/update`, data);
  }
}
