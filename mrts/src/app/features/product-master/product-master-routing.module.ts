import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductMasterDashboardComponent } from './pages/product-master-dashboard/product-master-dashboard.component';
import { AddProductMasterComponent } from './pages/add-product-master/add-product-master.component';
import { StockistOrderDetailsComponent } from './pages/stockist-order-details/stockist-order-details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'product-master-dashboard',
        component: ProductMasterDashboardComponent
      },
      {
        path: 'add-product-master',
        component: AddProductMasterComponent
      },
      {
        path: 'stockist-order-details',
        component: StockistOrderDetailsComponent
      },
      {
        path: '',
        redirectTo: 'product-master-dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMasterRoutingModule { }
