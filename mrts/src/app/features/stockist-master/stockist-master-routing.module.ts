import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockistMasterDashboardComponent } from './pages/stockist-master-dashboard/stockist-master-dashboard.component';
import { AddStockistComponent } from './pages/add-stockist/add-stockist.component';
import { OrderDetailsMasterComponent } from './pages/order-details-master/order-details-master.component';

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
        path: 'order-details-master',
        component: OrderDetailsMasterComponent
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
