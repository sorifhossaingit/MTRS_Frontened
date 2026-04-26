import { Component } from '@angular/core';
import {
  ClipboardList,
  ArrowLeft,
  User,
  MapPin,
  Package,
  ShoppingCart,
  FileText,
  Save,
  Navigation
} from 'lucide-angular';

@Component({
  selector: 'app-add-visit',
  templateUrl: './add-visit.component.html',
  styleUrl: './add-visit.component.css'
})
export class AddVisitComponent {

  // Icons
  ClipboardList = ClipboardList;
  ArrowLeft = ArrowLeft;
  User = User;
  MapPin = MapPin;
  Package = Package;
  ShoppingCart = ShoppingCart;
  FileText = FileText;
  Save = Save;
  Navigation = Navigation;

  // Sample Data
  mrList = ['Rahul', 'Amit', 'Suresh'];
  doctorList = ['Dr. Sharma', 'Dr. Roy', 'Dr. Das'];

  // Model
  visit: any = {};

  // GPS Simulation
  getLocation() {
    this.visit.gps = '22.5726, 88.3639'; // Kolkata sample
  }
}
