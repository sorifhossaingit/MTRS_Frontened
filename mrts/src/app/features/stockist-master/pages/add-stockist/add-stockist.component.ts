import { Component } from '@angular/core';
import {
  Building2,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building,
  Globe,
  Hash,
  FileText,
  Wallet,
  BadgeIndianRupee,
  Clock,
  Map,
  User,
  Layers,
  CheckCircle,
  Save
} from 'lucide-angular';

@Component({
  selector: 'app-add-stockist',
  templateUrl: './add-stockist.component.html',
  styleUrl: './add-stockist.component.css'
})
export class AddStockistComponent {

  // 🔷 Icons
  Building2 = Building2;
  ArrowLeft = ArrowLeft;
  Phone = Phone;
  Mail = Mail;
  MapPin = MapPin;
  Building = Building;
  Globe = Globe;
  Hash = Hash;
  FileText = FileText;
  Wallet = Wallet;
  BadgeIndianRupee = BadgeIndianRupee;
  Clock = Clock;
  Map = Map;
  User = User;
  Layers = Layers;
  CheckCircle = CheckCircle;
  Save = Save;

  // 🔷 Model
  stockist: any = {
    isActive: true
  };

}
