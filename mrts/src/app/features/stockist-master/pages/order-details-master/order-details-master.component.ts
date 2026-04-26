import { Component } from '@angular/core';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-angular';

@Component({
  selector: 'app-order-details-master',
  templateUrl: './order-details-master.component.html',
  styleUrl: './order-details-master.component.css'
})
export class OrderDetailsMasterComponent {

  // Icons
  ShoppingCart = ShoppingCart;
  Clock = Clock;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  Eye = Eye;

  // KPI
  totalOrders = 20;
  pendingOrders = 8;
  acceptedOrders = 10;
  rejectedOrders = 2;

  // Orders
  orders = [
    {
      date: '26 Apr',
      mr: 'Rahul',
      doctor: 'Dr. Sharma',
      products: 'Paracetamol, Antibiotic',
      value: 2500,
      status: 'Pending'
    },
    {
      date: '25 Apr',
      mr: 'Amit',
      doctor: 'Dr. Roy',
      products: 'Vitamin Tablets',
      value: 1500,
      status: 'Accepted'
    }
  ];

  // Update Status
  updateStatus(order: any, status: string) {
    order.status = status;
  }
}