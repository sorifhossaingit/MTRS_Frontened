import { Component } from '@angular/core';
import {
  PackagePlus,
  ArrowLeft,
  Package,
  ClipboardList,
  DollarSign,
  Box,
  FileCheck,
  TrendingUp,
  CheckCircle,
  Save
} from 'lucide-angular';

@Component({
  selector: 'app-add-product-master',
  templateUrl: './add-product-master.component.html',
  styleUrl: './add-product-master.component.css'
})
export class AddProductMasterComponent {
  PackagePlus = PackagePlus;
  ArrowLeft = ArrowLeft;
  Package = Package;
  ClipboardList = ClipboardList;
  DollarSign = DollarSign;
  Box = Box;
  FileCheck = FileCheck;
  TrendingUp = TrendingUp;
  CheckCircle = CheckCircle;
  Save = Save;
}
