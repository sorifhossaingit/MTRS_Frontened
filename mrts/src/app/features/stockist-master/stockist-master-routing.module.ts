import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockistMasterDashboardComponent } from './pages/stockist-master-dashboard/stockist-master-dashboard.component';
import { AddStockistComponent } from './pages/add-stockist/add-stockist.component';
import { OrderDetailsMasterComponent } from './pages/order-details-master/order-details-master.component';
import { StockistProductDashboardComponent } from './pages/stockist-product-dashboard/stockist-product-dashboard.component';
import { OrderMasterComponent } from './pages/order-master/order-master.component';
import { MedicineOrderMasterComponent } from './pages/medicine-order-master/medicine-order-master.component';
import { StockiestPersonalproductDashboardComponent } from './pages/stockiest-personalproduct-dashboard/stockiest-personalproduct-dashboard.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'stockist-master-dashboard',
        component: StockistMasterDashboardComponent
      },
      {
        path: 'add-stockist',
        component: AddStockistComponent
      },
      {
        path: 'stockist-product-dashboard',
        component: StockistProductDashboardComponent
      },
      {
        path: 'stockiest-personal-product',
        component: StockiestPersonalproductDashboardComponent
      },
      {
        path: 'order-master',
        component: OrderMasterComponent
      },
      {
        path: 'order-details-master',
        component: OrderDetailsMasterComponent
      },
      {
        path: 'medicine-order-master',
        component: MedicineOrderMasterComponent
      },
      {
        path: '',
        redirectTo: 'stockist-master-dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockistMasterRoutingModule { }
