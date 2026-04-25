import { Component } from '@angular/core';
import {
  MapPin,
  Plus,
  Map,
  ShoppingCart,
  DollarSign,
  Users,
  Eye
} from 'lucide-angular';

@Component({
  selector: 'app-master-visit-dashboard',
  templateUrl: './master-visit-dashboard.component.html',
  styleUrl: './master-visit-dashboard.component.css'
})
export class MasterVisitDashboardComponent {
 MapPin = MapPin;
  Plus = Plus;
  Map = Map;
  ShoppingCart = ShoppingCart;
  DollarSign = DollarSign;
  Users = Users;
  Eye = Eye;
}
