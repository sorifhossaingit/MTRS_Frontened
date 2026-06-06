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




//STOCKIST CREATE ORDER TO AGENCY

 stockist_create_order(data: any) {
    return this.http.post(`${this.apiUrl}/admin/stockiestorder/stockiest/create-order`, data);
  }

 get_available_Product_for_order(params: any) {
    return this.http.get(
      `${this.apiUrl}/admin/product/list`, { params });
  }
  
}
