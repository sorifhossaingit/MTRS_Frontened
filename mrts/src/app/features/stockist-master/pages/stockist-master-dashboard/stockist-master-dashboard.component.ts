import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  Building2,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  Wallet,
  BadgeIndianRupee
} from 'lucide-angular';

@Component({
  selector: 'app-stockist-master-dashboard',
  templateUrl: './stockist-master-dashboard.component.html',
  styleUrl: './stockist-master-dashboard.component.css'
})
export class StockistMasterDashboardComponent {

  
  Building2 = Building2;
  Plus = Plus;
  Eye = Eye;
  Pencil = Pencil;
  Trash2 = Trash2;
  CheckCircle = CheckCircle;
  Wallet = Wallet;
  BadgeIndianRupee = BadgeIndianRupee;

  
  searchText = '';
  filterType = '';
  filterStatus = '';

  
  stockists = [
    {
      id: 1,
      name: 'ABC Pharma',
      firmType: 'Distributor',
      contactPerson: 'Rahul Sharma',
      mobile: '9876543210',
      city: 'Kolkata',
      state: 'WB',
      drugLicense: 'DL12345',
      gst: 'GST12345',
      creditLimit: 500000,
      outstanding: 200000,
      assignedMR: 'Amit',
      isActive: true
    },
    {
      id: 2,
      name: 'Medico Hub',
      firmType: 'Wholesaler',
      contactPerson: 'Ankit Singh',
      mobile: '9123456780',
      city: 'Delhi',
      state: 'DL',
      drugLicense: 'DL54321',
      gst: 'GST54321',
      creditLimit: 300000,
      outstanding: 100000,
      assignedMR: 'Ravi',
      isActive: false
    }
  ];

  
  get filteredStockists() {
    return this.stockists.filter(s => {
      return (
        (!this.searchText || s.name.toLowerCase().includes(this.searchText.toLowerCase())) &&
        (!this.filterType || s.firmType === this.filterType) &&
        (!this.filterStatus || s.isActive.toString() === this.filterStatus)
      );
    });
  }

  get totalStockists() {
    return this.stockists.length;
  }

  get activeStockists() {
    return this.stockists.filter(s => s.isActive).length;
  }

  get totalOutstanding() {
    return this.stockists.reduce((sum, s) => sum + s.outstanding, 0);
  }

  get totalCreditLimit() {
    return this.stockists.reduce((sum, s) => sum + s.creditLimit, 0);
  }

}
