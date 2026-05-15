import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    let userRole = ''

    const rid = Number(localStorage.getItem('rid'));

    switch (rid) {

      case 1:
        userRole = 'Superadmin';
        break;

      case 2:
        userRole = 'Admin';
        break;

      case 3:
        userRole = 'MR';
        break;

      case 4:
        userRole = 'Stockist';
        break;

      case 5:
        userRole = 'Manager';
        break;

      default:
        userRole = '';
    }



    const allowedRoles = route.data['roles'];



    if (allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}