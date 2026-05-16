import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    let userRole = ''

    const rid = localStorage.getItem('rid');
    const isSuperAdmin = localStorage.getItem('is');

    if (isSuperAdmin === 'True') {
      userRole = 'Superadmin';

    } else {

      switch (rid) {

        case 'a5fabfee-5506-4e12-bfec-c898fc5af3ae':
          userRole = 'Admin';

          break;

        case 'FD1C87B5-524A-49E5-B60C-5D7B82DDEB43':
          userRole = 'MR';

          break;

        case '258FC58F-F4E8-4D51-9A19-7BC88F6F3D40':
          userRole = 'Stockist';

          break;

        case '39E853C2-805C-49F8-8527-15B2A9EDE106':
          userRole = 'Manager';

          break;

        default:
          userRole = '';
      }
    }



    const allowedRoles = route.data['roles'];



    if (allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}