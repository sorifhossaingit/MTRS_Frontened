import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent {
  activeTab: string = 'master';

  constructor(private router: Router, private route: ActivatedRoute) {}

  switchTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([`/doctor-master/${tab}`]);
  }
}
