import { Component } from '@angular/core';
import { Package, ShoppingCart } from 'lucide-angular';


@Component({
  selector: 'app-medicine-master',
  templateUrl: './medicine-master.component.html',
  styleUrl: './medicine-master.component.css'
})
export class MedicineMasterComponent {

  Package = Package;
  ShoppingCart = ShoppingCart;

  searchText = '';

  products = [
    {
      name: 'Paracetamol 500mg',
      category: 'Tablet',
      composition: 'Paracetamol',
      price: 50,
      image: 'https://via.placeholder.com/300x200',
      stockists: ['ABC Pharma', 'XYZ Distributors'],
      qty: 1
    },
    {
      name: 'Amoxicillin',
      category: 'Capsule',
      composition: 'Amoxicillin Trihydrate',
      price: 120,
      image: 'https://via.placeholder.com/300x200',
      stockists: ['HealthCorp', 'MediSupply'],
      qty: 1
    }
  ];

  placeOrder(product: any) {
    console.log('Order placed:', product);
  }
}
