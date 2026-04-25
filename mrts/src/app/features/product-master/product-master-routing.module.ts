import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductMasterDashboardComponent } from './pages/product-master-dashboard/product-master-dashboard.component';
import { AddProductMasterComponent } from './pages/add-product-master/add-product-master.component';

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
