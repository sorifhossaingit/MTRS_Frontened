import { Component } from '@angular/core';
import { Package, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'app-medicine-order-master',
  templateUrl: './medicine-order-master.component.html',
  styleUrl: './medicine-order-master.component.css'
})
export class MedicineOrderMasterComponent   {

  Package = Package;
  ShoppingCart = ShoppingCart;

  searchText = '';

  products = [
    {
      name: 'Paracetamol 500mg',
      category: 'Tablet',
      composition: 'Paracetamol',
      pack: '10x10',
      price: 50,
      stock: 200,
      image: 'https://via.placeholder.com/300x200',
      qty: 1
    },
    {
      name: 'Amoxicillin 250mg',
      category: 'Capsule',
      composition: 'Amoxicillin',
      pack: '10x10',
      price: 120,
      stock: 0,
      image: 'https://via.placeholder.com/300x200',
      qty: 1
    }
  ];

  placeOrder(product: any) {
    console.log('Order placed to company:', product);
  }
}
