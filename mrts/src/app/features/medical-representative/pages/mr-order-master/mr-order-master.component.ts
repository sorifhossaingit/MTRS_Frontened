import { Component } from '@angular/core';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-angular';

@Component({
  selector: 'app-mr-order-master',
  templateUrl: './mr-order-master.component.html',
  styleUrl: './mr-order-master.component.css'
})
export class MrOrderMasterComponent {

  Package = Package;
  Clock = Clock;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  Eye = Eye;

  totalOrders = 20;
  pending = 6;
  accepted = 10;
  rejected = 4;

  orders = [
    {
      id: 'ORD101',
      date: '26 Apr',
      doctor: 'Dr. Sharma',
      stockist: 'ABC Pharma',
      products: 'Paracetamol, Antibiotic',
      amount: 2500,
      status: 'Pending'
    },
    {
      id: 'ORD102',
      date: '25 Apr',
      doctor: 'Dr. Roy',
      stockist: 'XYZ Distributor',
      products: 'Vitamin Tablets',
      amount: 1800,
      status: 'Accepted'
    }
  ];

  viewOrder(order: any) {
    console.log('View Order:', order);
  }
}
