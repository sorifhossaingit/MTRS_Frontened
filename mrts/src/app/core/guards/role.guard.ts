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

        case 'fd1c87b5-524a-49e5-b60c-5d7b82ddeb43':
          userRole = 'MR';
          break;

        case '258fc58f-f4e8-4d51-9a19-7bc88f6f3d40':
          userRole = 'Stockist';
          break;

        case '11714ca6-4cdb-46c5-bb12-d582ef179bc2':
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