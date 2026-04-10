import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const userRole = localStorage.getItem('role'); // from login
    const allowedRoles = route.data['roles'];

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}