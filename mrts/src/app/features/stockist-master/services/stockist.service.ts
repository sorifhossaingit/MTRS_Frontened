import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface ListPersonalProductPayload {
  agencyId: number;
  createdBy: number;
  name?: string;
  brandName?: string;
  category?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}


@Injectable({
  providedIn: 'root'
})
export class StockistService {

  private apiUrl = environment.apiUrl;
  private authurl = environment.authurl

  constructor(private http: HttpClient) { }

  getstockistdashboarddetails(agencyid: any) {
    return this.http.get(
      `${this.apiUrl}/admin/stockiest/stockist-dashboard/${agencyid}`);
  }

  getstockistdetails(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin/stockiest/get-stockiestlist`, { params });
  }


  addstockist(data: any) {
    return this.http.post(`${this.apiUrl}/admin/stockiest/create-stockiest`, data);
  }


  updatestockistdetails(data: any) {
    return this.http.put(`${this.apiUrl}/admin/stockiest/update-stockeist`, data);
  }


  getAreamanagerlist(agencyId: any) {
    return this.http.get(
      `${this.apiUrl}/admin/area-manager/dropdown/active-area-managers/${agencyId}`);
  }

  reset_password(data: any) {
    return this.http.post(`${this.authurl}/Auth/reset-password`, data);
  }




  //STOCKIST ROLE API 



  get_stockist_inventory_list(data: any) {
    return this.http.post(`${this.apiUrl}/stockiest/inventory/list`, data);
  }

  update_stockist_product(data: any) {
    return this.http.put(`${this.apiUrl}/stockiest/product-update`, data);
  }



  //STOCKIST ORDER TO AGENCY

  getstockistorderdetails(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin/stockiestorder/stockiest-order-list`, { params });
  }

  getstockistorderpreview(orderid: any) {
    return this.http.get(
      `${this.apiUrl}/admin/stockiestorder/stockiest-order-details/${orderid}`);
  }

  update_stockist_status(data: any) {
    return this.http.put(`${this.apiUrl}/stockiest/update-order-status`, data);
  }



  //STOCKIST CREATE ORDER TO AGENCY

  stockist_create_order(data: any) {
    return this.http.post(`${this.apiUrl}/admin/stockiestorder/stockiest/create-order`, data);
  }

  get_available_Product_for_order(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin/product/list`, { params });
  }



  //MR ORDER TO STOCKIST 

  get_mr_order_list(data: any) {
    return this.http.post(`${this.apiUrl}/mrorder/mr-ordr-list`, data);
  }

  get_mr_order_preview(orderid: any) {
    return this.http.get(
      `${this.apiUrl}/mrorder/mr-order-details/${orderid}`);
  }

  update_mr_order_status(data: any) {
    return this.http.post(`${this.apiUrl}/mrorder/mrorder-accept-reject-bystockiest`, data);
  }

  // ---------------------------personal product------------

  list_stockiest_personal_product(payload: ListPersonalProductPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/stockiest/list-stockiest-personal-product`, payload);
  }


  create_personal_product(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stockiest/create-personal-product`, formData);
  }

  update_personal_product(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stockiest/update-personal-product`, formData);
  }

}
