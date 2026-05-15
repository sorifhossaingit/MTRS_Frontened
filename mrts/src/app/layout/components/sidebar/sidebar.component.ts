import { Component, OnInit, OnDestroy } from '@angular/core';
import { MENU_ITEMS, MenuItem } from '../../../core/config/sidebar.config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  menuItems: MenuItem[] = [];
  userRole: string = '';
  expandedItems: Set<string> = new Set();
  isMobileSidebarOpen = false;
  isSmallScreen = false;

  private resizeHandler = () => this.checkScreenSize();

  ngOnInit() {
    const rid = Number(localStorage.getItem('rid'));

    switch (rid) {

      case 1:
        this.userRole = 'Superadmin';
        break;

      case 2:
        this.userRole = 'Admin';
        break;

      case 3:
        this.userRole = 'MR';
        break;

      case 4:
        this.userRole = 'Stockist';
        break;

      case 5:
        this.userRole = 'Manager';
        break;

      default:
        this.userRole = '';
    }

    // ✅ Filter parent + children
    this.menuItems = MENU_ITEMS
      .filter(item => item.roles.includes(this.userRole))
      .map(item => ({
        ...item,
        children: item.children?.filter(child =>
          child.roles.includes(this.userRole)
        )
      }));

    this.checkScreenSize();
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  toggleExpand(label: string) {
    this.expandedItems.has(label)
      ? this.expandedItems.delete(label)
      : this.expandedItems.add(label);
  }

  isExpanded(label: string): boolean {
    return this.expandedItems.has(label);
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1024;

    if (!this.isSmallScreen) {
      this.isMobileSidebarOpen = false;
    }
  }
}