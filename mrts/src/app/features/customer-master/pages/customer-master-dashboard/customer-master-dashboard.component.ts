import { Component } from '@angular/core';
import { CustomerMasterModule } from '../../customer-master.module';
import {
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  Upload,
  Eye,
  Pencil,
  Trash2
} from 'lucide-angular';

@Component({
  selector: 'app-customer-master-dashboard',
  templateUrl: './customer-master-dashboard.component.html',
  styleUrl: './customer-master-dashboard.component.css'
})
export class CustomerMasterDashboardComponent {

 Users = Users;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  TrendingUp = TrendingUp;
  Plus = Plus;
  Upload = Upload;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;

}
