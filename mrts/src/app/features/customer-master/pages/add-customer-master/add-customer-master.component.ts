import { Component } from '@angular/core';
import {
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText,
  Users,
  Save
} from 'lucide-angular';
@Component({
  selector: 'app-add-customer-master',
  templateUrl: './add-customer-master.component.html',
  styleUrl: './add-customer-master.component.css'
})
export class AddCustomerMasterComponent {

  UserPlus = UserPlus;
  ArrowLeft = ArrowLeft;
  User = User;
  Phone = Phone;
  MapPin = MapPin;
  FileText = FileText;
  Users = Users;
  Save = Save;
}
