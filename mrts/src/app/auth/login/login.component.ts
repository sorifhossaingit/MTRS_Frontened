import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private router: Router) {}

  ngOnInit() {
  const token = localStorage.getItem('token');

  if (token) {
    this.router.navigate(['/dashboard']);
  }
}



  login() {

  // Dummy users (for testing)
  const users = [
    { email: 'superadmin@test.com', password: '1234', role: 'Superadmin' },
    { email: 'admin@test.com', password: '1234', role: 'Admin' },
    { email: 'mr@test.com', password: '1234', role: 'MR' },
    { email: 'stockist@test.com', password: '1234', role: 'Stockist' },
    { email: 'manager@test.com', password: '1234', role: 'Manager' }
  ];

  const user = users.find(
    u => u.email === this.email && u.password === this.password
  );

  if (user) {
    localStorage.setItem('token', '123');
    localStorage.setItem('role', user.role);

    // role-based navigation
    switch (user.role) {
      case 'Superadmin':
        this.router.navigate(['/super-admin-master/super-admin-dashboard']);
        break;
      
      case 'Admin':
        this.router.navigate(['/dashboard']);
        break;

      case 'MR':
        this.router.navigate(['/medical-representative-master/mr-attendance']); // or /visits
        break;

      case 'Stockist':
        this.router.navigate(['/stockist-master/stockist-product-dashboard']);
        break;

      case 'Manager':
        this.router.navigate(['/visits/visit-master-dashboard']);
        break;

      default:
        this.router.navigate(['/login']);
    }

   } else {
    alert('Invalid email or password');
   }
 }

}
