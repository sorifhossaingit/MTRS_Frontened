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
    const rid = localStorage.getItem('rid');
    const isSuperAdmin = localStorage.getItem('is');

    if (isSuperAdmin === 'True') {
      this.userRole = 'Superadmin';

    } else {

      switch (rid) {

        case 'a5fabfee-5506-4e12-bfec-c898fc5af3ae':
          this.userRole = 'Admin';
          break;

        case 'fd1c87b5-524a-49e5-b60c-5d7b82ddeb43':
          this.userRole = 'MR';
          break;

        case '258fc58f-f4e8-4d51-9a19-7bc88f6f3d40':
          this.userRole = 'Stockist';
          break;

        case '11714ca6-4cdb-46c5-bb12-d582ef179bc2':
          this.userRole = 'Manager';
          break;

        default:
          this.userRole = '';
      }
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