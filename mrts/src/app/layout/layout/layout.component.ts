import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  @ViewChild('sidebar') sidebarComponent!: SidebarComponent;

  toggleSidebar() {
    if (this.sidebarComponent) {
      this.sidebarComponent.toggleMobileSidebar();
    }
  }
}

