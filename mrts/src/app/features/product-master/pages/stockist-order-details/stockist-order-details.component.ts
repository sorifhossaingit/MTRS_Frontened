import { Component } from '@angular/core';
import {
  ClipboardList,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-angular';

@Component({
  selector: 'app-stockist-order-details',
  templateUrl: './stockist-order-details.component.html',
  styleUrl: './stockist-order-details.component.css'
})
export class StockistOrderDetailsComponent {

  ClipboardList = ClipboardList;
  Package = Package;
  Clock = Clock;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  Eye = Eye;

  totalOrders = 30;
  pending = 10;
  approved = 15;
  rejected = 5;

  orders = [
    {
      date: '26 Apr',
      stockist: 'ABC Pharma',
      mr: 'Rahul',
      products: 'Paracetamol, Antibiotic',
      amount: 2500,
      status: 'Pending'
    },
    {
      date: '25 Apr',
      stockist: 'XYZ Distributors',
      mr: 'Amit',
      products: 'Vitamin Tablets',
      amount: 1800,
      status: 'Approved'
    }
  ];

  updateStatus(order: any, status: string) {
    order.status = status;
  }

  viewOrder(order: any) {
    console.log('View order:', order);
  }
}
