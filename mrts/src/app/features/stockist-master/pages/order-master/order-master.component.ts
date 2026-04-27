import { Component } from '@angular/core';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-angular';

@Component({
  selector: 'app-order-master',
  templateUrl: './order-master.component.html',
  styleUrl: './order-master.component.css'
})
export class OrderMasterComponent {

  Package = Package;
  Clock = Clock;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  Eye = Eye;

  totalOrders = 25;
  pending = 8;
  accepted = 12;
  rejected = 5;

  orders = [
    {
      id: 'ORD001',
      date: '26 Apr',
      mr: 'Rahul',
      doctor: 'Dr. Sharma',
      products: 'Paracetamol, Antibiotic',
      amount: 2500,
      status: 'Pending'
    },
    {
      id: 'ORD002',
      date: '25 Apr',
      mr: 'Amit',
      doctor: 'Dr. Roy',
      products: 'Vitamin Tablets',
      amount: 1800,
      status: 'Accepted'
    }
  ];

  viewOrder(order: any) {
    console.log('View order:', order);
  }
}
