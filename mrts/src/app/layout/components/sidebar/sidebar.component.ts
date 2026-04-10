import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS, MenuItem } from '../../../core/config/sidebar.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  menuItems: MenuItem[] = [];
  userRole: string | null = '';

  ngOnInit() {
    this.userRole = localStorage.getItem('role');

    this.menuItems = MENU_ITEMS.filter((item: { roles: string | string[]; }) =>
      item.roles.includes(this.userRole!)
    );
  }
}
